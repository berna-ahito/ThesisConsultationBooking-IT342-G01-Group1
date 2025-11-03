import { GoogleLogin } from "@react-oauth/google";

export default function GoogleAuthButton({
  onSuccess,
  onError,
  text = "signin_with",
}) {
  return (
    <div className="google-button-container">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        size="large"
        text={text}
        shape="rectangular"
        width="100%"
        logo_alignment="left"
      />
    </div>
  );
}
