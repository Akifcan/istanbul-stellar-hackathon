pragma circom 2.1.6;

include "circomlib/circuits/poseidon.circom";

// Proves the prover knows a `secret` whose commitment Poseidon(secret) is a
// leaf of a depth-2 Merkle tree with the given `root`, and outputs a
// per-campaign `nullifier`. Reveals nothing about which leaf or the secret.
template Membership(depth) {
    signal input secret;                 // private
    signal input pathElements[depth];    // private
    signal input pathIndex[depth];       // private (0/1 per level)
    signal input root;                   // public
    signal input campaignId;             // public
    signal output nullifier;             // public

    // leaf = Poseidon(secret)
    component leaf = Poseidon(1);
    leaf.inputs[0] <== secret;

    signal cur[depth + 1];
    cur[0] <== leaf.out;

    component hash[depth];
    signal left[depth];
    signal right[depth];
    signal diff[depth];

    for (var i = 0; i < depth; i++) {
        // pathIndex must be boolean
        pathIndex[i] * (pathIndex[i] - 1) === 0;

        diff[i] <== pathElements[i] - cur[i];
        // left  = idx==0 ? cur : path
        left[i]  <== cur[i] + pathIndex[i] * diff[i];
        // right = idx==0 ? path : cur
        right[i] <== pathElements[i] - pathIndex[i] * diff[i];

        hash[i] = Poseidon(2);
        hash[i].inputs[0] <== left[i];
        hash[i].inputs[1] <== right[i];
        cur[i + 1] <== hash[i].out;
    }

    root === cur[depth];

    component nul = Poseidon(2);
    nul.inputs[0] <== secret;
    nul.inputs[1] <== campaignId;
    nullifier <== nul.out;
}

component main { public [root, campaignId] } = Membership(2);
