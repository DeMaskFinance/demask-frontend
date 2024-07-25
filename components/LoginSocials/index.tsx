import { useEffect, useState } from "react";
import { CapsuleModal, OAuthMethod } from "@usecapsule/react-sdk";
import { Button } from "../Buttons";

export const LoginSocials = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [Modal, setCapsuleModalComponent] = useState<
    typeof CapsuleModal | null
  >(null);
  const [capsuleInstance, setCapsuleInstance] = useState<any>(null);
  console.log(process.env.NEXT_PUBLIC_CAPSULE_API_KEY);

  async function loadCapsule() {
    let loadedInstance;
    if (!capsuleInstance) {
      const CapsuleModule = await import("@usecapsule/react-sdk");
      loadedInstance = new CapsuleModule.default(
        CapsuleModule.Environment.DEVELOPMENT,
        process.env.NEXT_PUBLIC_CAPSULE_API_KEY
      );
    }
    return loadedInstance;
  }

  useEffect(() => {
    // Perform localStorage action
    setShouldRender(true);
    loadCapsule().then((capsule) => {
      setCapsuleInstance(capsule);
    });
  }, []);

  useEffect(() => {
    async function loadCapsuleModule() {
      const { CapsuleModal } = await import("@usecapsule/react-sdk");
      setCapsuleModalComponent(() => CapsuleModal);
    }
    loadCapsuleModule();
  }, []);

  useEffect(() => {
    loadCapsule().then((capsule) => {
      setCapsuleInstance(capsule);
    });
  }, []);

  if (!Modal || !capsuleInstance || !shouldRender) return null;

  return (
    <div className="text-white">
      <Button
        primary
        className="h-10 mt-10 mx-auto px-3"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Open Capsule
      </Button>
      <Modal
        capsule={capsuleInstance}
        // oAuthMethods={[
        //   OAuthMethod.GOOGLE,
        //   OAuthMethod.FACEBOOK,
        //   OAuthMethod.TWITTER,
        //   OAuthMethod.DISCORD,
        // ]}
        appName={"NextJS Example"}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};
