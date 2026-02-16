import { graphql } from "@/graphql";
import "server-only";

export const AdminPageStatisticsQueryDocument = graphql(`
  query AdminPageStatistics {
    BestSellingCategoriesStatisticLastSevenDays: bestSellingCategoriesStatistic(
      limit: 5
      timePeriod: LAST_SEVEN_DAYS
    ) {
      category {
        id
        slug
      }
      itemsSold
      totalRevenueInCents
    }
    BestSellingCategoriesStatisticLastThirtyDaysFragment: bestSellingCategoriesStatistic(
      limit: 5
      timePeriod: LAST_THIRTY_DAYS
    ) {
      category {
        id
        slug
      }
      itemsSold
      totalRevenueInCents
    }
    BestSellingCategoriesStatisticLastNinetyDaysFragment: bestSellingCategoriesStatistic(
      limit: 5
      timePeriod: LAST_NINETY_DAYS
    ) {
      category {
        id
        slug
      }
      itemsSold
      totalRevenueInCents
    }
    RevenuePerDayLastNinetyDaysFragment: revenuePerDayStatistic(
      timePeriod: LAST_NINETY_DAYS
    ) {
      percentChange
      points {
        date
        revenue
      }
      timePeriod
    }
    RevenuePerDayLastSevenDaysFragment: revenuePerDayStatistic(
      timePeriod: LAST_SEVEN_DAYS
    ) {
      percentChange
      points {
        date
        revenue
      }
      timePeriod
    }
    RevenuePerDayLastThirtyDaysFragment: revenuePerDayStatistic(
      timePeriod: LAST_THIRTY_DAYS
    ) {
      percentChange
      points {
        date
        revenue
      }
      timePeriod
    }
    BestSellingProductVariantsStatisticLastSevenDaysFragment: bestSellingProductVariantsStatistic(
      limit: 5
      timePeriod: LAST_SEVEN_DAYS
    ) {
      quantitySold
      productVariant {
        id
        sku
        thumbnailImage {
          url
        }
        product {
          id
          slug
          thumbnailImage {
            url
          }
        }
      }
    }
    BestSellingProductVariantsStatisticLastThirtyDaysFragment: bestSellingProductVariantsStatistic(
      limit: 5
      timePeriod: LAST_THIRTY_DAYS
    ) {
      quantitySold
      productVariant {
        id
        sku
        thumbnailImage {
          url
        }
        product {
          id
          slug
          thumbnailImage {
            url
          }
        }
      }
    }
    BestSellingProductVariantsStatisticLastNinetyDaysFragment: bestSellingProductVariantsStatistic(
      limit: 5
      timePeriod: LAST_NINETY_DAYS
    ) {
      quantitySold
      productVariant {
        id
        sku
        thumbnailImage {
          url
        }
        product {
          id
          slug
          thumbnailImage {
            url
          }
        }
      }
    }
  }
`);
