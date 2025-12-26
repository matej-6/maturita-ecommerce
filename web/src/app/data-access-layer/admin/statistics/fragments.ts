import { graphql } from "@/graphql";

export const RevenuePerDayLastNinentyDaysFragent = graphql(`
  fragment RevenuePerDayLastNinetyDaysFragment on Query {
    revenuePerDayStatistic(timePeriod: LAST_NINETY_DAYS) {
      percentChange
      points {
        x
        y
        label
      }
      timePeriod
    }
  }
`);

export const ReveuePerDayLastSevenDaysFragment = graphql(`
  fragment RevenuePerDayLastSevenDaysFragment on Query {
    revenuePerDayStatistic(timePeriod: LAST_SEVEN_DAYS) {
      percentChange
      points {
        x
        y
        label
      }
      timePeriod
    }
  }
`);

export const BestSellingCategoriesStatisticLastSevenDaysFragment = graphql(`
  fragment BestSellingCategoriesStatisticLastSevenDaysFragment on Query {
    bestSellingCategoriesStatistic(limit: 5, timePeriod: LAST_SEVEN_DAYS) {
      category {
        id
        slug
      }
      itemsSold
      totalRevenueInCents
    }
  }
`);

export const BestSellingProductVariantsStatisticLastSevenDaysFragment =
  graphql(`
    fragment BestSellingProductVariantsStatisticLastSevenDaysFragment on Query {
      bestSellingProductVariantsStatistic(
        limit: 5
        timePeriod: LAST_SEVEN_DAYS
      ) {
        productVariant {
          id
          sku
          product {
            id
            name
            slug
          }
        }
        quantitySold
      }
    }
  `);

export const BestSellingCategoriesStatisticLastThirtyDaysFragment = graphql(`
  fragment BestSellingCategoriesStatisticLastThirtyDaysFragment on Query {
    bestSellingCategoriesStatistic(limit: 5, timePeriod: LAST_THIRTY_DAYS) {
      category {
        id
        slug
      }
      itemsSold
      totalRevenueInCents
    }
  }
`);

export const BestSellingProductVariantsStatisticLastThirtyDaysFragment =
  graphql(`
    fragment BestSellingProductVariantsStatisticLastThirtyDaysFragment on Query {
      bestSellingProductVariantsStatistic(
        limit: 5
        timePeriod: LAST_THIRTY_DAYS
      ) {
        productVariant {
          id
          sku
          product {
            id
            name
            slug
          }
        }
        quantitySold
      }
    }
  `);

export const BestSellingCategoriesStatisticLastNinetyDaysFragment = graphql(`
  fragment BestSellingCategoriesStatisticLastNinetyDaysFragment on Query {
    bestSellingCategoriesStatistic(limit: 5, timePeriod: LAST_NINETY_DAYS) {
      category {
        id
        slug
      }
      itemsSold
      totalRevenueInCents
    }
  }
`);

export const BestSellingProductVariantsStatisticLastNinetyDaysFragment =
  graphql(`
    fragment BestSellingProductVariantsStatisticLastNinetyDaysFragment on Query {
      bestSellingProductVariantsStatistic(
        limit: 5
        timePeriod: LAST_NINETY_DAYS
      ) {
        productVariant {
          id
          sku
          product {
            id
            name
            slug
          }
        }
        quantitySold
      }
    }
  `);
