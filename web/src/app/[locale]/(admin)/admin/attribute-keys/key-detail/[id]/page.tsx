import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { Card } from "@/components/ui/card";
import { getAttributeKeyDetailsPageQueryAction } from "@/app/data-access-layer/admin/product-variant-attribute/actions";
import { AttributeKeyTranslationSheetForm } from "../../../forms/attribute-key-translation-sheet-form";
import { AttributeTranslationSheetForm } from "../../../forms/attribute-translation-sheet-form";
import { DeleteAttributeButton } from "../../../components/attribute-keys/delete-attribute-button";
import { DeleteAttributeTranslationButton } from "../../../components/attribute-keys/delete-attribute-translation-button";
import { DeleteAttributeKeyTranslationButton } from "../../../components/attribute-keys/delete-attribute-key-translation-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { AttributeSheetForm } from "../../../forms/attribute-sheet-form";
import { DeleteAttributeKeyButton } from "../../../components/attribute-keys/delete-attribute-key-button";

export const dynamic = "force-dynamic";

export default async function AttributeKeyDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return notFound();
  }

  const res = await getAttributeKeyDetailsPageQueryAction(parsedId);
  if (!res.success) {
    return <div>{res.message}</div>;
  }

  if (!res.data?.productVariantAttributeKey) {
    return notFound();
  }

  const locale = await getLocale();

  const { productVariantAttributeKey: data, locales } = res.data;

  const missingLocales = locales.filter(
    (l) => !data.translations.find((t) => t.locale === l.code),
  );

  const t = await getTranslations("admin.attributeKeys.page");
  const ft = await getTranslations("fields");

  return (
    <div className=" flex flex-col p-2 sm:p-4 gap-y-8">
      <div className="flex flex-col gap-y-8">
        <h1 className="font-medium ">{t("title")}</h1>
        <div className="flex flex-wrap gap-4">
          {[
            { label: ft("attributeKey.id"), node: <span>{data.id}</span> },
            { label: ft("attributeKey.key"), node: <span>{data.key}</span> },
            {
              label: ft("attributeKey.createdAt"),
              node: (
                <span>{new Date(data.createdAt).toLocaleString(locale)}</span>
              ),
            },
            {
              label: ft("attributeKey.updatedAt"),
              node: (
                <span>{new Date(data.updatedAt).toLocaleString(locale)}</span>
              ),
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-y-0 w-36 sm:w-64">
              <span className="font-mono text-xs leading-[120%] text-muted-foreground">
                {item.label}
              </span>
              {item.node}
            </div>
          ))}
        </div>
      </div>
      <div className="h-px w-full rounded-full bg-accent" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">{t("translations.title")}</h2>

        <div className="flex flex-wrap gap-4">
          {data.translations.map((t) => {
            const { flag, name } =
              locales.find((l) => l.code === t.locale) || {};

            return (
              <Card
                key={t.locale}
                className="p-1! sm:p-2! min-w-[200px] flex flex-row items-center gap-x-2"
              >
                <div>
                  {flag}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({name || t.locale})
                  </span>
                </div>
                <div>{t.keyTranslation}</div>
                <DeleteAttributeKeyTranslationButton
                  id={t.id}
                  keyId={data.id}
                />
              </Card>
            );
          })}
        </div>
        {missingLocales.length > 0 && (
          <div>
            <AttributeKeyTranslationSheetForm
              attributeKeyId={data.id}
              locales={missingLocales}
            />
          </div>
        )}
      </div>
      <div className="h-px w-full rounded-full bg-accent" />
      <div className="flex flex-col gap-y-8">
        <h2 className="font-medium">{t("attributes.title")}</h2>

        <div className="flex flex-wrap gap-4">
          {data.attributes.map((attr) => {
            const missingAttributeLocales = locales.filter(
              (l) => !attr.translations.find((at) => at.locale === l.code),
            );

            return (
              <Card
                key={attr.id}
                className="p-2! sm:p-4! min-w-[400px] flex flex-col gap-y-4"
              >
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm text-muted-foreground">
                    {t("attributes.title")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: ft("attribute.id"),
                        node: <span>{attr.id}</span>,
                      },
                      {
                        label: ft("attribute.value"),
                        node: <span>{attr.value}</span>,
                      },
                    ].map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="flex flex-col gap-y-0 w-36 sm:w-64"
                        >
                          <span className="font-mono text-xs leading-[120%] text-muted-foreground">
                            {item.label}
                          </span>
                          {item.node}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="h-px w-full bg-muted" />
                <div className="flex flex-col gap-y-2">
                  <span className="text-sm text-muted-foreground">
                    {t("attributes.translations.title")}
                  </span>
                  <div className="flex flex-wrap gap-4">
                    {attr.translations.map((t) => {
                      const { flag, name } =
                        locales.find((l) => l.code === t.locale) || {};

                      return (
                        <Card
                          key={t.locale}
                          className="p-1! sm:p-2! min-w-[200px] flex flex-row items-center gap-x-2"
                        >
                          <div>
                            {flag}{" "}
                            <span className="text-sm text-muted-foreground">
                              ({name || t.locale})
                            </span>
                          </div>
                          <div>{t.value}</div>
                          <DeleteAttributeTranslationButton
                            id={t.id}
                            keyId={data.id}
                          />
                        </Card>
                      );
                    })}
                  </div>
                  {missingAttributeLocales.length > 0 && (
                    <div>
                      <AttributeTranslationSheetForm
                        attributeId={attr.id}
                        locales={missingAttributeLocales}
                        keyId={data.id}
                      />
                    </div>
                  )}
                </div>
                <div className="h-px w-full rounded-full bg-accent" />
                <div className="flex flex-col gap-y-1">
                  <span className="text-sm text-muted-foreground">
                    {t("attributes.productVariants.title")}
                  </span>
                  <Table className="p-0!">
                    <TableHeader>
                      <TableRow className="*:font-mono *:font-bold *:text-muted-foreground *:px-2 *:py-1">
                        <TableHead>{ft("productVariant.id")}</TableHead>
                        <TableHead>{ft("productVariant.sku")}</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attr.productVariants.length === 0 ? (
                        <TableRow className="*:px-2 *:py-1">
                          <TableCell
                            colSpan={3}
                            className="text-center py-4 text-muted-foreground"
                          >
                            {t("attributes.productVariants.noProductVariants")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        attr.productVariants.map((pv) => (
                          <TableRow key={pv.id} className="*:px-2 *:py-1">
                            <TableCell>{pv.id}</TableCell>
                            <TableCell>{pv.sku}</TableCell>
                            <TableCell>
                              <Link
                                href={`/admin/products/product-detail/${pv.productId}`}
                              >
                                {t("attributes.productVariants.viewPageButton")}
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="h-px w-full rounded-full bg-accent" />
                <div>
                  <DeleteAttributeButton id={attr.id} keyId={data.id} />
                </div>
              </Card>
            );
          })}
        </div>
        <div>
          <AttributeSheetForm
            keys={[
              {
                id: data.id,
                key: data.key,
              },
            ]}
            showKeyOptions={false}
          />
        </div>
      </div>
      <div className="h-px w-full rounded-full bg-accent" />
      <div>
        <DeleteAttributeKeyButton id={data.id} />
      </div>
    </div>
  );
}
