import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const CategoriesQuery = graphql(`
  query AllCategories {
    categories {
      id
      name
      description
      subcategories {
        id
        name
        description
      }
    }
  }
`);

export function Header() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => execute(CategoriesQuery),
  });
  return (
    <header>
      <nav>
        {data?.categories.map((category) => (
          <Link href={`/category/${category.id}`} key={category.id}>
            {category.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
