import { Button, Img, Section, Tailwind, Text } from '@react-email/components';

import * as config from '@documenso/tailwind-config';

export type TemplateForgotPasswordProps = {
  resetPasswordLink: string;
  assetBaseUrl: string;
};

export const TemplateForgotPassword = ({
  resetPasswordLink,
  assetBaseUrl,
}: TemplateForgotPasswordProps) => {
  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: config.theme.extend.colors,
          },
        },
      }}
    >
      <Section className="mt-4 flex-row items-center justify-center">
        <div className="flex items-center justify-center p-4">
          <Img className="h-42" src={getAssetUrl('/static/document.png')} alt="Documenso" />
        </div>

        <Text className="text-primary mx-auto mb-0 max-w-[80%] text-center text-lg font-semibold">
          Forgot your password?
        </Text>

        <Text className="my-1 text-center text-base text-slate-400">
          That's okay, it happens! Click the button below to reset your password.
        </Text>

        <Section className="mb-6 mt-8 text-center">
          <Button
            className="bg-documenso-500 inline-flex items-center justify-center rounded-lg px-6 py-3 text-center text-sm font-medium text-black no-underline"
            href={resetPasswordLink}
          >
            Reset Password
          </Button>
        </Section>
      </Section>
    </Tailwind>
  );
};

export default TemplateForgotPassword;
