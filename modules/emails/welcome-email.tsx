import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Img,
  Link,
} from "@react-email/components";

type WelcomeEmailProps = {
  firstName?: string;
};

export default function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to PDFBridge</Preview>

      <Body style={{ backgroundColor: "#f6f8fb", margin: 0 }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "32px",
            marginTop: "40px",
            borderRadius: "8px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Logo */}
          <Section style={{ marginBottom: "24px" }}>
            <Img
              src="https://www.pdfbridge.xyz/pdfbridge_logo.svg"
              alt="PDFBridge"
              width="32"
              height="32"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            />
            <Text
              style={{
                display: "inline-block",
                marginLeft: "10px",
                fontSize: "20px",
                fontWeight: "700",
                verticalAlign: "middle",
              }}
            >
              PDFBridge
            </Text>
          </Section>

          <Text>Hi {firstName ?? "there"},</Text>

          <Text>
            Welcome to <strong>PDFBridge</strong>.
          </Text>

          <Text>
            PDFBridge is a simple API that converts HTML or web pages into
            high-quality PDF files. Developers use it to generate invoices,
            reports, receipts, certificates, and any other documents that need
            to be PDFs.
          </Text>

          <Text>
            You can integrate PDFBridge directly into your application and start
            generating PDFs programmatically in minutes.
          </Text>

          <Link
            href="https://pdfbridge.xyz/dashboard"
            style={{
              display: "inline-block",
              marginTop: "16px",
              padding: "10px 16px",
              backgroundColor: "#0a0e27",
              color: "#ffffff",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Go to Dashboard →
          </Link>

          <Text style={{ fontSize: "12px", color: "#888", marginTop: "32px" }}>
            PDFBridge · accounts@pdfbridge.xyz
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
