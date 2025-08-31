import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContinueWithGoogleLightButton } from "@/components/buttons/continue-with-google-light-button";

export function OAuth2Card() {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-4">
        <ContinueWithGoogleLightButton />
      </CardContent>
    </Card>
  );
}
