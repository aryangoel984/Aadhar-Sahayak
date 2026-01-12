#include<iostream>
using namespace std;

class TreeNode{
public:
    TreeNode* left;
    TreeNode* right;
    int val;

    TreeNode(int val){
        this->val = val;
        this->left = NULL;
        this->right = NULL;
    }
};
int levels(TreeNode* root){
    if(root==NULL) return 0;
    return 1 + max(levels(root->left),levels(root->right));
}
int levelOrder(TreeNode* root){
    // vector<int>ans;
    queue<pair<int,TreeNode*>>qu;
    qu.push({0,root});
    vector<vector<int>>answer(levels(root));
    while(!qu.empty()){
        pair<int,TreeNode*>p = qu.front();
        int level = p.first;
        TreeNode* node = p.second;
        qu.pop();
        answer[level].push_back(node->val);
        if(node->left) qu.push({level+1,node->left});
        if(node->right) qu.push({level+1,node->right});
    }
    int sumMax = -1e9;
    int maxi = -1;
   for(int i=0;i<answer.size();i++){
    int sum = 0;
    for(int j=0;j<answer[i].size();j++){
        sum += answer[i][j];
    }
    if(sum>sumMax){
        sumMax= sum;
        maxi = i+1;
    }
    
   }
   return maxi;
}
int main(){
    TreeNode* a = new TreeNode(1);
    TreeNode* b = new TreeNode(7);
    TreeNode* c = new TreeNode(0);
    TreeNode* d = new TreeNode(7);
    TreeNode* e = new TreeNode(-8);
    a->left = b;
    a->right = c;
    b->left = d;
    b->right = e;
    cout<<levelOrder(a);
    return 0;
}