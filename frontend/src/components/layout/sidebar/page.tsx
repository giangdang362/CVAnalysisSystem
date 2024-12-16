"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FormOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TableOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, ConfigProvider, Divider } from "antd";
import { PiReadCvLogoFill } from "react-icons/pi";
import { SiOpenjdk } from "react-icons/si";
import { MdDashboard } from "react-icons/md";

import { cn } from "@/src/lib/utils";
import { onStart } from "@/src/lib/router-events/events";
import { useCollapse } from "@/hooks/use-collapse-store";
import { APP_ROUTES } from "@/configs/routes";

type MenuItem = Required<MenuProps>["items"][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

/**
 * @description Sidebar Navigation Configuration, These are what you want to see in the sidebar.
 */
const items: MenuProps["items"] = [
  getItem(
    APP_ROUTES?.Dashboard?.title,
    APP_ROUTES?.Dashboard?.path,
    <UserOutlined />
  ),
  getItem(APP_ROUTES?.CV?.title, APP_ROUTES?.CV?.path, <MdDashboard />),
  getItem(APP_ROUTES?.JD?.title, APP_ROUTES?.JD?.path, <SiOpenjdk />),
  getItem(APP_ROUTES?.Table?.title, APP_ROUTES?.Table?.path, <TableOutlined />),
];

const SiderPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { isCollapsed, onOpen, onClose } = useCollapse();
  const selectedKeys = "/" + pathname.split("/").reverse()[0];

  const onClick: MenuProps["onClick"] = (e) => {
    const url = e.keyPath.reverse().join("");
    if (pathname !== url) {
      router.push(url);
      onStart();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-y-auto scrollbar overflow-x-hidden transition-all",
        isCollapsed ? "w-[50px]" : "w-[210px]"
      )}
    >
      <ConfigProvider
        theme={{
          token: {
            motion: false,
          },
          components: {
            Menu: {
              collapsedIconSize: 14,
              collapsedWidth: 50,
              itemBorderRadius: 0,
              // subMenuItemBg: "#ffffff",
              itemMarginInline: 0,
              itemMarginBlock: 0,
              // itemSelectedColor: "#5248e5",
              // itemSelectedBg: "#eeedfc",
            },
          },
        }}
      >
        <Menu
          onClick={onClick}
          defaultSelectedKeys={[selectedKeys]}
          defaultOpenKeys={["/form-page"]}
          mode="inline"
          items={items}
          inlineCollapsed={isCollapsed}
        />
      </ConfigProvider>
      <div className="mt-auto">
        <div className="mb-[60px] relative hidden md:block">
          <ConfigProvider
            theme={{
              components: {
                Divider: {
                  marginLG: 12,
                },
              },
            }}
          >
            <Divider />
          </ConfigProvider>
          {isCollapsed ? (
            <MenuUnfoldOutlined
              onClick={onClose}
              className="text-lg ml-[18px]"
            />
          ) : (
            <MenuFoldOutlined onClick={onOpen} className="text-lg ml-[18px]" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SiderPage;
export { items };
export type { MenuItem };
