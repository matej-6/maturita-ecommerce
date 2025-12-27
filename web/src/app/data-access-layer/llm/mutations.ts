import { graphql } from "@/graphql";
import "server-only";

export const NewLLMTaskMutation = graphql(`
  mutation newLLMTask($prompt: String!, $productId: Int) {
    createLlmTask(input: { prompt: $prompt, productId: $productId }) {
      id
    }
  }
`);
