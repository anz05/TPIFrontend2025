import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import Modal from "../../shared/components/Modal";
import ExtraInfoForm from "./ExtraInfoForm";
import Button from "../../shared/components/Button";
import confetti from "canvas-confetti";

const OrderManager = forwardRef(({ cartItems, onSuccess }, ref) => {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);

  const launchConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const startOrder = () => {
    setIsOpenInfo(true);
  };

  const handleSuccessInfo = () => {
    setIsOpenInfo(false);
    launchConfetti();
    setIsOpenSuccess(true);
    localStorage.removeItem("cart");
  };

  useImperativeHandle(ref, () => ({
    triggerOrder: startOrder,
  }));

  return (
    <>
      <Modal isOpen={isOpenInfo} onClose={() => setIsOpenInfo(false)}>
        <ExtraInfoForm
          onCancel={() => setIsOpenInfo(false)}
          onSuccess={handleSuccessInfo}
        />
      </Modal>

      <Modal isOpen={isOpenSuccess} onClose={() => setIsOpenSuccess(false)}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="text-2xl font-bold">Orden realizada</div>

          <Button
            onClick={() => {
              setIsOpenSuccess(false);
              if (onSuccess) {
                onSuccess();
              }
            }}
          >
            Cerrar
          </Button>
        </div>
      </Modal>

      <button
        id="hiddenOrder"
        style={{ display: "none" }}
        onClick={startOrder}
      />
    </>
  );
});

OrderManager.displayName = "OrderManager";
export default OrderManager;
