"use server";

import { getAdminStatisticsPageData } from "@/app/data-access-layer/admin/statistics/actions";
import { TotalRevenueChartBar } from "./components/charts/total-revenue-chart";
import { BestSellingCategoriesChart } from "./components/charts/best-selling-categories-chart";
import { BestSellingProductVariantsChart } from "./components/charts/best-selling-product-variants-chart";

export default async function AdminPage() {
  const data = await getAdminStatisticsPageData();

  if (!data.success || !data.data) {
    return <div>Error loading data...</div>;
  }

  const {
    BestSellingCategoriesStatisticLastNinetyDaysFragment,
    BestSellingCategoriesStatisticLastSevenDays,
    BestSellingCategoriesStatisticLastThirtyDaysFragment,
    BestSellingProductVariantsStatisticLastNinetyDaysFragment,
    BestSellingProductVariantsStatisticLastSevenDaysFragment,
    BestSellingProductVariantsStatisticLastThirtyDaysFragment,
    RevenuePerDayLastNinetyDaysFragment,
    RevenuePerDayLastSevenDaysFragment,
    RevenuePerDayLastThirtyDaysFragment,
  } = data.data;

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="grid auto-rows-min gap-4 xl:grid-cols-2">
        <BestSellingCategoriesChart
          data30Days={BestSellingCategoriesStatisticLastThirtyDaysFragment!.map(
            (d) => ({
              itemsSold: d.itemsSold,
              slug: d.category.slug,
              totalRevenue: parseFloat(
                (d.totalRevenueInCents / 100).toFixed(2)
              ),
            })
          )}
          data7Days={BestSellingCategoriesStatisticLastSevenDays!.map((d) => ({
            itemsSold: d.itemsSold,
            slug: d.category.slug,
            totalRevenue: parseFloat((d.totalRevenueInCents / 100).toFixed(2)),
          }))}
          data90Days={BestSellingCategoriesStatisticLastNinetyDaysFragment!.map(
            (d) => ({
              itemsSold: d.itemsSold,
              slug: d.category.slug,
              totalRevenue: parseFloat(
                (d.totalRevenueInCents / 100).toFixed(2)
              ),
            })
          )}
        />
        <BestSellingProductVariantsChart
          data7Days={BestSellingProductVariantsStatisticLastSevenDaysFragment!.map(
            (d) => ({
              quantitySold: d.quantitySold,
              sku: d.productVariant.sku,
            })
          )}
          data30Days={BestSellingProductVariantsStatisticLastThirtyDaysFragment!.map(
            (d) => ({
              quantitySold: d.quantitySold,
              sku: d.productVariant.sku,
            })
          )}
          data90Days={BestSellingProductVariantsStatisticLastNinetyDaysFragment!.map(
            (d) => ({
              quantitySold: d.quantitySold,
              sku: d.productVariant.sku,
            })
          )}
        />
        {/* <div className="bg-muted/50 aspect-video rounded-xl" /> */}
      </div>
      {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
      <TotalRevenueChartBar
        data7Days={{
          points: RevenuePerDayLastSevenDaysFragment!.points.map((p) => ({
            date: p.x,
            label: p.y,
            revenue: p.y,
          })),
          trend: RevenuePerDayLastSevenDaysFragment!.percentChange,
        }}
        data90Days={{
          points: RevenuePerDayLastNinetyDaysFragment!.points.map((p) => ({
            date: p.x,
            label: p.y,
            revenue: p.y,
          })),
          trend: RevenuePerDayLastNinetyDaysFragment!.percentChange,
        }}
        data30Days={{
          points: RevenuePerDayLastThirtyDaysFragment!.points.map((p) => ({
            date: p.x,
            label: p.y,
            revenue: p.y,
          })),
          trend: RevenuePerDayLastThirtyDaysFragment!.percentChange,
        }}
      />
    </div>
  );
}
