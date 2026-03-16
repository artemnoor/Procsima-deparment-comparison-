export type RecommendationInput = {
  userInterests: string[];
  shortlistedDirectionIds: string[];
};

export type RecommendationResult = {
  directionIds: string[];
  explanation: string;
};
