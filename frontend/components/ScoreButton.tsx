import React from "react";
import { Button } from "antd";

const getTextColor = (score: number) => {
  if (score <= 40) return "gray"; // Lowest score, not highlighted
  if (score <= 60) return "lightblue"; // Medium-low score
  if (score <= 80) return "orange"; // Medium-high score
  if (score <= 100) return "#15c508"; // Highest score, highly highlighted
  return "black"; // Fallback color (default)
};

const ScoreButton = ({ score }: {score: number}) => {
  return (
    <Button
      style={{
        fontWeight: 700,
        color: getTextColor(score),
        borderColor: getTextColor(score)
      }}
    >
      {score}
    </Button>
  );
};

export default ScoreButton;