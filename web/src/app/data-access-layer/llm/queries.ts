import { graphql } from "@/graphql";
import "server-only";

export const LLMUserTaskByIdQuery = graphql(`
  query LLMUserTaskById($id: Int!) {
    getUserLLMTaskById(id: $id) {
      id
      response {
        text
        products {
          id
          slug
          name
          thumbnailImage {
            mimeType
            base64
          }
        }
      }
      status
      date
    }
  }
`);
