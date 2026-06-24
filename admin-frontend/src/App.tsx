import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './router';
import { setMessageInstance } from './api/request';
import { useEffect } from 'react';

function AppInitializer() {
  const { message } = AntApp.useApp();

  useEffect(() => {
    setMessageInstance(message);
  }, [message]);

  return null;
}

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <AntApp>
        <RouterProvider router={router} />
        <AppInitializer />
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
