from app.agents.utils import llm, SCHEMA_STRING, clean_sql, execute_sql_query
from app.agents.prompts import planner_prompt, worker_prompt, critic_prompt

def ask_agent(user_query: str):
    reasoning_log = ""
    
    def log(message: str):
        nonlocal reasoning_log
        print(message)
        reasoning_log += message + "\n"

    try:
        log(f"🚀 **STARTING MULTI-AGENT WORKFLOW**")
        log(f"❓ Query: {user_query}\n")
        
        # --- PHASE 1: PLANNING ---
        log("🤖 **Step 1: Planner Agent**")
        plan_chain = planner_prompt | llm
        plan = plan_chain.invoke({"query": user_query, "schema": SCHEMA_STRING}).content
        log(f"📋 *Plan Generated:*\n{plan}\n")
        
        # --- PHASE 2: CODING, CRITIQUING & EXECUTING (The "Self-Healing" Loop) ---
        current_plan = plan
        last_error = ""
        final_result = ""
        
        # We give it 5 attempts to get both Syntax AND Runtime right
        for attempt in range(5):
            log(f"🔨 **Step 2: Worker Agent (Attempt {attempt+1})**")
            
            worker_input = current_plan
            if last_error:
                worker_input += f"\n\n🚨 PREVIOUS ERROR: {last_error}\nConstraint: Fix the specific error above."
                
            worker_chain = worker_prompt | llm
            generated_sql = clean_sql(worker_chain.invoke({
                "plan": worker_input, 
                "schema": SCHEMA_STRING
            }).content)
            
            log(f"   Draft SQL:\n   ```sql\n   {generated_sql}\n   ```")
            
            # Sub-Step: Critic Review
            log("🧐 **Step 3: Critic Agent**")
            critic_chain = critic_prompt | llm
            review = critic_chain.invoke({
                "query": user_query, 
                "sql": generated_sql, 
                "schema": SCHEMA_STRING
            }).content
            
            if "APPROVED" not in review:
                log(f"   ❌ CRITIC REJECTED: {review}")
                last_error = review
                continue # Loop back to Worker
            
            log("   ✅ Critic Approved. Testing on Database...")
            
            # Sub-Step: Test Execution (The "Runtime Check")
            result_str = execute_sql_query(generated_sql)
            
            if "Error" in result_str:
                log(f"   💥 RUNTIME CRASH: {result_str}")
                # This is the Magic: Feed the DB error back to the Worker!
                last_error = f"The SQL was syntactically correct but crashed the DB: {result_str}"
                continue # Loop back to Worker
            else:
                log(f"   🎉 SUCCESS! Data retrieved.")
                final_result = result_str
                break
        
        if not final_result:
            return "❌ I tried 5 times but could not generate working SQL.\n\n" + reasoning_log

        # --- PHASE 3: SUMMARY ---
        log(f"🚀 **Step 4: Final Summary**")
        log(f"   📊 Data Found: {final_result[:200]}..." if len(final_result) > 200 else f"   📊 Data Found: {final_result}")
            
        summary_prompt = f"""
        You are a Policy Analyst.
        User Query: "{user_query}"
        Data Found: {final_result}
        
        Explain the answer clearly based on the data. 
        """
        final_answer = llm.invoke(summary_prompt).content
        
        full_response = (
            f"{final_answer}\n\n"
            f"---\n"
            f"### 🧠 AI Reasoning Trace\n"
            f"{reasoning_log}"
        )
        return full_response

    except Exception as e:
        return f"System Workflow Error: {str(e)}"