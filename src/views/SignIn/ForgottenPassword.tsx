import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Modal } from "../../components";

export const ForgottenPassword: React.FC<{ prefill: () => void }> = ({ prefill }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClose = useCallback(() => {
    navigate("/sign-in", { state: location.state });
  }, [navigate, location.state]);

  return (
    <Modal.Wrapper onClose={onClose}>
      <Modal.Title>Forgotten Password 🤦</Modal.Title>
      <Modal.Body>
        <div className="flex flex-col space-y-4">
          <p>Trust me, I've been there. So many times.</p>
          <p>
            Simply enter <em>"jane@petite.com"</em> as your username and <em>"supersafe"</em> as
            your password — and you're good to go.
          </p>
          <p>
            <em>Psst:</em> Just because it's you, you can also prefill the form right here:
          </p>
          <Button
            label="Prefill credentials"
            onClick={() => {
              prefill();
              onClose();
            }}
          />
        </div>
      </Modal.Body>
    </Modal.Wrapper>
  );
};
