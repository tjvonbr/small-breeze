import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface VercelInviteUserEmailProps {
  invitedByFirstName: string;
  invitedByLastName: string;
  invitedByEmail: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function TeamInviteEmail({
  invitedByFirstName,
  invitedByLastName,
  teamName,
  inviteLink,
}: VercelInviteUserEmailProps) {
  const invitedByFullName = `${invitedByFirstName} ${invitedByLastName}`;
  const previewText = `Join ${invitedByFullName} on Breezeway!`;

  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/vercel-logo.png`}
                width="40"
                height="37"
                alt="Breezeway Logo"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Join <strong>{teamName}</strong> on <strong>Breezeway</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hey there!,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{invitedByFullName}</strong> has invited you to the <strong>{teamName}</strong> on{' '}
              <strong>Smallbreeze</strong>!
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{' '}
              <Link href={inviteLink} className="text-blue-600 no-underline">
                {inviteLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
