// Plain (non-client) profile data so it can be imported on the server (e.g.
// the ZK verification route) as well as in the client store.
export type DemoProfile = {
  id: string
  name: string
  tagline: string
  interests: string[]
  // Fixed per-profile secret (decimal string) for Groth16 proof generation.
  secret: string
}

export const PROFILES: DemoProfile[] = [
  {
    id: "p_tech",
    name: "Deniz",
    tagline: "Tech & Gaming",
    interests: ["technology", "gaming", "finance"],
    secret: "111111111111111111",
  },
  {
    id: "p_life",
    name: "Ece",
    tagline: "Food & Fitness",
    interests: ["food", "fitness", "sports"],
    secret: "222222222222222222",
  },
  {
    id: "p_style",
    name: "Mert",
    tagline: "Fashion & Travel",
    interests: ["fashion", "travel", "music"],
    secret: "333333333333333333",
  },
  {
    id: "p_learn",
    name: "Aylin",
    tagline: "Finance & Learning",
    interests: ["finance", "education", "technology"],
    secret: "444444444444444444",
  },
]
