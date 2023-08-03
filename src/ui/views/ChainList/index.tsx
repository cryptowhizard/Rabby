import PillsSwitch from '@/ui/component/PillsSwitch';
import { Chain } from '@debank/common';
import { Tabs } from 'antd';
import clsx from 'clsx';
import { CHAINS } from 'consts';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { PageHeader } from 'ui/component';
import './style.less';
import { useTranslation } from 'react-i18next';

const Null = () => null;

const List = ({ list }: { list: Chain[] }) => {
  return (
    <div className="overflow-auto max-h-full">
      <div className="chain-list">
        {list.map((item) => {
          return (
            <div className="chain-list-item" key={item.id}>
              <img src={item.logo} alt="" />
              {item.name}
            </div>
          );
        })}
        {list.length % 2 !== 0 && <div className="chain-list-item"></div>}
      </div>
    </div>
  );
};

const ChainList = () => {
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };

  const { t } = useTranslation();
  const [selectedTab, onTabChange] = useState<'mainnet' | 'testnet'>('mainnet');

  const list = useMemo(
    () =>
      Object.values(CHAINS).sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 1;
      }),
    []
  );

  const [mainnet, testnet] = useMemo(() => {
    return [
      list.filter((item) => !item.isTestnet),
      list.filter((item) => item.isTestnet),
    ];
  }, []);
  const renderTabBar = React.useCallback(() => <Null />, []);

  return (
    <div className="page-chain-list">
      <PageHeader onBack={goBack} fixed>
        {t('page.chainList.title', { count: list.length })}
      </PageHeader>
      <PillsSwitch
        value={selectedTab}
        onTabChange={onTabChange}
        className="flex bg-[#e2e6ec] w-[228px] mx-[auto] my-[0] h-[32px] p-[2px] mb-[14px]"
        itemClassname={clsx('w-[112px] py-[7px] text-[12px]')}
        itemClassnameInActive={clsx('text-[#4B4d59]')}
        options={
          [
            {
              key: 'mainnet',
              label: `Mainnets (${mainnet.length})`,
            },
            {
              key: 'testnet',
              label: `Testnets (${testnet.length})`,
            },
          ] as const
        }
      />
      <Tabs
        className="h-full"
        renderTabBar={renderTabBar}
        activeKey={selectedTab}
      >
        <Tabs.TabPane key="mainnet" destroyInactiveTabPane={false}>
          <List list={mainnet} />
        </Tabs.TabPane>
        <Tabs.TabPane key="testnet">
          <List list={testnet} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ChainList;
