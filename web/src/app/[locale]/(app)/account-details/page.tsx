"use server";

import { getAccountDetailsPageData } from "@/app/data-access-layer/user.queries";
import { getImageSrc } from "@/app/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AccountDetailsPage() {
  const data = await getAccountDetailsPageData();

  if (!data.success || !data.data?.me) {
    return (
      <div className="max-width-container mt-6 xl:mt-12">
        <h1 className="text-2xl font-medium">
          Failed to load account details.
        </h1>
      </div>
    );
  }

  const user = data.data.me;

  return (
    <div className="max-width-container mt-6 xl:mt-12">
      <div className="flex flex-col gap-y-3">
        <h1 className="text-2xl font-medium">Account Details</h1>
        <Card className="w-full flex flex-col gap-y-2">
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] flex flex-col">
              <span className="font-mono text-[8px] leading-[120%]">
                Name and Last Name
              </span>
              <span>
                {user.firstName} {user.lastName}
              </span>
            </div>
            <Button size={"xs"} variant={"secondary"}>
              Edit
            </Button>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] flex flex-col">
              <span className="font-mono text-[8px] leading-[120%]">Email</span>
              <span>{user.email}</span>
            </div>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] flex flex-col">
              <span className="font-mono text-[8px] leading-[120%]">
                Avatar
              </span>
              {user.avatar ? (
                <img
                  src={getImageSrc(user.avatar.mimeType, user.avatar.base64)}
                  alt="User avatar"
                />
              ) : (
                <div className="rounded-full bg-cyan-600 size-12 flex items-center justify-center">
                  <span className="text-white text-3xl font-medium">
                    {user.firstName!.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <Button size={"xs"} variant={"secondary"}>
              Change Avatar
            </Button>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] flex flex-col">
              <span className="font-mono text-[8px] leading-[120%]">
                Password
              </span>
              <span>********</span>
            </div>
            <Button size={"xs"} variant={"secondary"}>
              Edit
            </Button>
          </div>
          <div className="bg-muted h-0.5 w-full" />
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] flex flex-col">
              <span className="font-mono text-[8px] leading-[120%]">
                Updated At
              </span>
              <span>{user.updatedAt}</span>
            </div>
          </div>
          <div className="w-full flex justify-between items-start">
            <div className="w-[200px] flex flex-col">
              <span className="font-mono text-[8px] leading-[120%]">
                Member Since
              </span>
              <span>{user.createdAt}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
