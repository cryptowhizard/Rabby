import React from 'react';
import clsx from 'clsx';
import { WALLET_BRAND_CONTENT } from '@/constant';
import { useCommonPopupView, useWallet } from '@/ui/utils';
import { useLedgerDeviceConnected } from '@/utils/ledger';
import { CommonAccount } from './CommonAccount';

const LegerIcon = WALLET_BRAND_CONTENT.LEDGER.icon;

export const LedgerAccount: React.FC = () => {
  const wallet = useWallet();
  const { setVisible } = useCommonPopupView();
  const hasConnectedLedgerHID = useLedgerDeviceConnected();
  const [useLedgerLive, setUseLedgerLive] = React.useState(false);

  const status = React.useMemo(() => {
    if (useLedgerLive) {
      return 'CONNECTED';
    }
    return hasConnectedLedgerHID ? 'CONNECTED' : 'DISCONNECTED';
  }, [hasConnectedLedgerHID, useLedgerLive]);

  const signal = React.useMemo(() => {
    switch (status) {
      case undefined:
      case 'DISCONNECTED':
        return 'DISCONNECTED';

      default:
        return 'CONNECTED';
    }
  }, [status]);

  React.useEffect(() => {
    wallet.isUseLedgerLive().then(setUseLedgerLive);
  }, []);

  const handleConnect = () => {
    setVisible('Ledger');
  };

  const TipContent = () => {
    switch (status) {
      case 'DISCONNECTED':
        return (
          <div className="flex justify-between w-full">
            <div className="text-red-forbidden">Ledger is not connected</div>
            <div
              onClick={handleConnect}
              className={clsx('underline cursor-pointer', 'font-normal')}
            >
              Connect
            </div>
          </div>
        );

      default:
        return <div className="text-gray-subTitle">Ledger is connected</div>;
    }
  };

  return (
    <CommonAccount signal={signal} icon={LegerIcon} tip={<TipContent />} />
  );
};
