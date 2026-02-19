"use client";

// Core
import { Sidebar } from "primereact/sidebar";
import { Menu } from "primereact/menu";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/providers/ThemeProvider";
import { useContext, useEffect, useRef, useState, useTransition } from "react";

// Components
import Cart from "@/lib/ui/useable-components/cart";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useUser from "@/lib/hooks/useUser";


// Icons
import { CartSvg } from "@/lib/utils/assets/svg";
import { faChevronDown, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faGlobe } from "@fortawesome/free-solid-svg-icons";
// Interface
import { IAppBarProps } from "@/lib/utils/interfaces";
import { ToastContext } from "@/lib/context/global/toast.context";
// Constants
import { languageTypes } from "@/lib/utils/constants";
import { useLocale, useTranslations } from "next-intl";
import { TLocale } from "@/lib/utils/types/locale";
import { setUserLocale } from "@/lib/utils/methods/locale";
import { Dialog } from "primereact/dialog";

import CustomButton from "@/lib/ui/useable-components/button";

const AppTopbar = ({ handleModalToggle }: IAppBarProps) => {
  // State for cart sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] =
    useState(false);
  const t = useTranslations();
  const [, startTransition] = useTransition();
  const currentLocale = useLocale();

  // REf
  const menuRef = useRef<Menu>(null);
  const languageMenuRef = useRef<Menu>(null);

  //Theme Provider
  const { theme, toggleTheme } = useTheme();

  const [position, setPosition] = useState<"left" | "right">("right");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dir = document.documentElement.getAttribute("dir") || "ltr";
      setPosition(dir === "rtl" ? "left" : "right");
    }
  }, []);
  // Hooks
  const router = useRouter();
  const { CURRENCY_SYMBOL } = useConfig();
  const { cartCount, calculateSubtotal, profile } = useUser();
  const {
    authToken,
    setIsAuthModalVisible,
    setActivePanel,
    setAuthToken,
  } = useAuth();

  // Format subtotal for display
  const formattedSubtotal =
    cartCount > 0
      ? `${CURRENCY_SYMBOL}${calculateSubtotal()}`
      : `${CURRENCY_SYMBOL}0`;

  //Locale Configuration
  function onLocaleChange(value: string) {
    const locale = value as TLocale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  const { showToast } = useContext(ToastContext);
  const onLogout = () => {
    router.replace("/");
    setActivePanel(0);
    setAuthToken("");
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    //Give Toast Alert You Logout Successfully
    showToast({
      type: "success",
      title: t("logoutSuccessToastTitle"),
      message: t("logoutSuccessToastMessage"),
    });
    setLogoutConfirmationVisible(false);
  };

  const logoClickHandler = () => {
    router.push("/");
  };

  //Language DropDoDowm
  // const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // const handleLanguageChange = (lang: string) => {
  //   localStorage.setItem("language", lang);
  //   setShowLanguageDropdown(false);
  //   showToast({
  //     type: "success",
  //     title: "Language Changed",
  //     message: `Language switched to ${lang.toUpperCase()}`,
  //   });
  // };


  // Language Modal
  const model = languageTypes.map((lang) => ({
    label: lang.value.toUpperCase(),
    template(item: any) {
      return (
        <div
          className={`hover:bg-primary-color ${currentLocale === lang.code ? "bg-primary-color" : ""} p-2 cursor-pointer`}
          onClick={() => onLocaleChange(lang.code)}
        >
          {item.label}
        </div>
      );
    },
    command: () => {
      onLocaleChange(lang.code);
    },
  }));

  return (
    <>
      <nav
        className="w-screen shadow-sm dark:shadow-gray-600 z-50 bg-white dark:bg-gray-900 layout-top-bar"
      >
        <div className="w-full">
          <PaddingContainer>
            <div className="flex items-center justify-between w-full h-20 sm:h-16 flex-wrap md:flex-nowrap">
              {/* Left Section */}
              <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
                <div
                  onClick={logoClickHandler}
                  className="text-xl font-bold text-gray-900 dark:text-white"
                >
                  <span className="text-xl font-bold tracking-tight">IT-SHORT</span>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center justify-end gap-2 flex-shrink-0">
                {!authToken ? (
                  <button
                    className="w-auto min-w-[64px] h-fit py-2 md:py-3 px-4 bg-primary-color rounded text-sm lg:text-[16px] md:text-md flex items-center justify-center"
                    onClick={handleModalToggle}
                  >
                    <span className="text-white font-semibold text-xs md:text-[16px] whitespace-nowrap">
                      {t("login_label")}
                    </span>
                  </button>
                ) : (
                  <div
                    className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
                    onClick={(event) => menuRef.current?.toggle(event)}
                    aria-controls="popup_menu_right"
                    aria-haspopup
                  >
                    <div className="h-6 w-6 md:w-8 md:h-8 rounded-full bg-primary-color flex items-center justify-center text-white font-semibold select-none uppercase">
                      {profile?.name
                        ?.trim()
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("") || "U"}
                    </div>

                    {cartCount == 0 && (
                      <span className="hidden xl:inline hover:cursor-pointer dark:text-white">
                        {profile?.name || ""}
                      </span>
                    )}

                    <FontAwesomeIcon
                      icon={faChevronDown}
                      width={12}
                      hanging={12}
                      className="text-primary-color"
                    />
                    <Menu
                      className="
                     dark:bg-gray-800
                     dark:text-white
                     
                     "
                      model={[
                        {
                          label: t("ProfileSection.profile_label"),
                          template(item) {
                            return (
                              <div
                                className="text-gray-600 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600  p-2 cursor-pointer"
                                onClick={() => router.push("/profile")}
                              >
                                {item.label}
                              </div>
                            );
                          },
                        },
                        {
                          label: t("ProfileSection.logout_appbar"),
                          template(item) {
                            return (
                              <div
                                className="text-gray-500 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600 p-2  cursor-pointer"
                                onClick={() =>
                                  setLogoutConfirmationVisible(true)
                                }
                              >
                                {item.label}
                              </div>
                            );
                          },
                        },
                      ]}
                      popup
                      ref={menuRef}
                      id="popup_menu_right"
                      popupAlignment="right"
                    />
                  </div>
                )}
                {/* Language Dropdown */}{" "}
                <div className="relative flex items-center gap-x-2" title="Languages">
                  <div
                    onClick={toggleTheme}
                    className="cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {theme === "dark" ? "🌙" : "☀️"}
                  </div>{" "}
                  <button
                    onClick={(e) => languageMenuRef.current?.toggle(e)}
                    className="flex items-center justify-center"
                  >
                    {" "}
                    <FontAwesomeIcon
                      icon={faGlobe}
                      width={24}
                      height={24}
                      className="text-gray-700 dark:text-gray-400"
                    />{" "}
                  </button>{" "}
                  <Menu
                    model={model}
                    popup
                    ref={languageMenuRef}
                    id="language_menu_popup"
                    popupAlignment="left"
                    className="
                      dark:bg-gray-800 dark:text-white mt-5
        [&_.p-menu-list]:max-h-72 
        [&_.p-menu-list]:overflow-y-auto
        [&_.p-menu-list]:scrollbar-thin
        shadow-lg
      "
                  />
                </div>
                {/* Cart Button */}
                <div className="p-1 cursor-pointer">
                  {cartCount > 0 && (
                    <div
                      className="hidden lg:flex items-center justify-between bg-primary-color rounded-lg px-4 py-3 w-64 cursor-pointer"
                      onClick={() => {
                        if (!authToken) {
                          setIsAuthModalVisible(true); // ⬅️ Show login/signup modal
                        } else {
                          setIsCartOpen(true); // ⬅️ Open cart drawer
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="bg-white text-primary-color rounded-full w-5 h-5 flex items-center justify-center text-[10px] sm:text-[12px]">
                          {cartCount}
                        </div>
                        <span className="ml-2 text-white text-[14px] font-semibold sm:text-[14px]">
                          {t("show_items_btn")}
                        </span>
                      </div>
                      <span className="text-white text-[14px] sm:text-[16px]">
                        {formattedSubtotal}
                      </span>
                    </div>
                  )}
                  <div
                    className={`${cartCount > 0 ? "lg:hidden" : ""} flex items-center justify-center rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-500 relative`}
                    onClick={() => {
                      if (!authToken) {
                        setIsAuthModalVisible(true);
                      } else {
                        setIsCartOpen(true);
                      }
                    }}
                  >
                    <div className="block sm:hidden">
                      <CartSvg color="black" width={18} height={18} />
                    </div>
                    <div className="hidden sm:block">
                      <CartSvg color="black" width={22} height={22} />
                    </div>
                    {cartCount > 0 && authToken && (
                      <div className="absolute -top-1 -right-1 bg-black text-primary-color text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </PaddingContainer>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <Sidebar
        position={position} // ✅ dynamic position
        visible={isCartOpen}
        onHide={() => {
          setIsCartOpen(false);
          localStorage.setItem(
            "newOrderInstructions",
            localStorage.getItem("orderInstructions") || ""
          );
          localStorage.removeItem("orderInstructions");
          window.dispatchEvent(new Event("orderInstructionsUpdated"));
        }}
        className={`!ml-0 !p-0 !m-0 w-full md:w-[430px] lg:w-[580px] dark:bg-gray-800`}
      >
        <Cart
          onClose={() => {
            setIsCartOpen(false);
            localStorage.setItem(
              "newOrderInstructions",
              localStorage.getItem("orderInstructions") || ""
            );
            localStorage.removeItem("orderInstructions");
            window.dispatchEvent(new Event("orderInstructionsUpdated"));
          }}
        />
      </Sidebar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        contentClassName="dark:bg-gray-800"
        maskClassName="bg-black/80"
        visible={logoutConfirmationVisible}
        onHide={() => setLogoutConfirmationVisible(false)}
        className="w-[95%] sm:w-[80%] md:w-[60%] lg:w-1/3 rounded-xl px-8 bg-white dark:bg-gray-800 dark:text-white"
        header={
          <div className="w-full flex justify-center">
            <span className="font-inter font-bold text-lg text-gray-800  dark:text-white ">
              {t("Are_you_sure_you_want_to_log_out?")}
            </span>
          </div>
        }
        headerClassName="!justify-center dark:bg-gray-800"
        closable={true}
        dismissableMask
      >
        <div className="flex flex-col items-center text-center space-y-4 dark:bg-gray-800 dark:text-white">
          {/* Action buttons */}
          <div className="flex justify-center gap-3 w-full ">
            <CustomButton
              label={t("cancel_address")}
              className="w-1/2 h-fit bg-transparent dark:text-white text-gray-900 py-2 border border-gray-400 rounded-full text-sm font-medium"
              onClick={() => setLogoutConfirmationVisible(false)}
            />

            <button
              className="w-1/2 h-fit flex items-center justify-center gap-2 bg-primary-color text-white py-2 rounded-full text-sm font-medium"
              onClick={onLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              {t("logoutButton")}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
