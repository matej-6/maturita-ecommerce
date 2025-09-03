import { graphql } from "@/graphql";

const MeAdminFieldQuery = graphql(`
  query MeAdminField {
    me {
      id
    }
  }
`);
