import derived from "../../_styles/common/dark.mjs";
import _common_default from "./_common.mjs";
import { changeColor, scaleColor } from "seemly";
//#region src/tag/styles/dark.ts
const tagDark = {
  name: "Tag",
  common: derived,
  self(vars) {
    const {
      textColor2,
      primaryColorHover,
      primaryColorPressed,
      primaryColor,
      infoColor,
      successColor,
      warningColor,
      errorColor,
      baseColor,
      borderColor,
      tagColor,
      opacityDisabled,
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHover,
      closeColorPressed,
      borderRadiusSmall: borderRadius,
      fontSizeMini,
      fontSizeTiny,
      fontSizeSmall,
      fontSizeMedium,
      heightMini,
      heightTiny,
      heightSmall,
      heightMedium,
      buttonColor2Hover,
      buttonColor2Pressed,
      fontWeightStrong
    } = vars;
    return {
      ..._common_default,
      closeBorderRadius: borderRadius,
      heightTiny: heightMini,
      heightSmall: heightTiny,
      heightMedium: heightSmall,
      heightLarge: heightMedium,
      borderRadius,
      opacityDisabled,
      fontSizeTiny: fontSizeMini,
      fontSizeSmall: fontSizeTiny,
      fontSizeMedium: fontSizeSmall,
      fontSizeLarge: fontSizeMedium,
      fontWeightStrong,
      textColorCheckable: textColor2,
      textColorHoverCheckable: textColor2,
      textColorPressedCheckable: textColor2,
      textColorChecked: baseColor,
      colorCheckable: "#0000",
      colorHoverCheckable: buttonColor2Hover,
      colorPressedCheckable: buttonColor2Pressed,
      colorChecked: primaryColor,
      colorCheckedHover: primaryColorHover,
      colorCheckedPressed: primaryColorPressed,
      border: `1px solid ${borderColor}`,
      textColor: textColor2,
      color: tagColor,
      colorBordered: "#0000",
      closeIconColor,
      closeIconColorHover,
      closeIconColorPressed,
      closeColorHover,
      closeColorPressed,
      borderPrimary: `1px solid ${changeColor(primaryColor, {
        alpha: .3
      })}`,
      textColorPrimary: primaryColor,
      colorPrimary: changeColor(primaryColor, {
        alpha: .16
      }),
      colorBorderedPrimary: "#0000",
      closeIconColorPrimary: scaleColor(primaryColor, {
        lightness: .7
      }),
      closeIconColorHoverPrimary: scaleColor(primaryColor, {
        lightness: .7
      }),
      closeIconColorPressedPrimary: scaleColor(primaryColor, {
        lightness: .7
      }),
      closeColorHoverPrimary: changeColor(primaryColor, {
        alpha: .16
      }),
      closeColorPressedPrimary: changeColor(primaryColor, {
        alpha: .12
      }),
      borderInfo: `1px solid ${changeColor(infoColor, {
        alpha: .3
      })}`,
      textColorInfo: infoColor,
      colorInfo: changeColor(infoColor, {
        alpha: .16
      }),
      colorBorderedInfo: "#0000",
      closeIconColorInfo: scaleColor(infoColor, {
        alpha: .7
      }),
      closeIconColorHoverInfo: scaleColor(infoColor, {
        alpha: .7
      }),
      closeIconColorPressedInfo: scaleColor(infoColor, {
        alpha: .7
      }),
      closeColorHoverInfo: changeColor(infoColor, {
        alpha: .16
      }),
      closeColorPressedInfo: changeColor(infoColor, {
        alpha: .12
      }),
      borderSuccess: `1px solid ${changeColor(successColor, {
        alpha: .3
      })}`,
      textColorSuccess: successColor,
      colorSuccess: changeColor(successColor, {
        alpha: .16
      }),
      colorBorderedSuccess: "#0000",
      closeIconColorSuccess: scaleColor(successColor, {
        alpha: .7
      }),
      closeIconColorHoverSuccess: scaleColor(successColor, {
        alpha: .7
      }),
      closeIconColorPressedSuccess: scaleColor(successColor, {
        alpha: .7
      }),
      closeColorHoverSuccess: changeColor(successColor, {
        alpha: .16
      }),
      closeColorPressedSuccess: changeColor(successColor, {
        alpha: .12
      }),
      borderWarning: `1px solid ${changeColor(warningColor, {
        alpha: .3
      })}`,
      textColorWarning: warningColor,
      colorWarning: changeColor(warningColor, {
        alpha: .16
      }),
      colorBorderedWarning: "#0000",
      closeIconColorWarning: scaleColor(warningColor, {
        alpha: .7
      }),
      closeIconColorHoverWarning: scaleColor(warningColor, {
        alpha: .7
      }),
      closeIconColorPressedWarning: scaleColor(warningColor, {
        alpha: .7
      }),
      closeColorHoverWarning: changeColor(warningColor, {
        alpha: .16
      }),
      closeColorPressedWarning: changeColor(warningColor, {
        alpha: .11
      }),
      borderError: `1px solid ${changeColor(errorColor, {
        alpha: .3
      })}`,
      textColorError: errorColor,
      colorError: changeColor(errorColor, {
        alpha: .16
      }),
      colorBorderedError: "#0000",
      closeIconColorError: scaleColor(errorColor, {
        alpha: .7
      }),
      closeIconColorHoverError: scaleColor(errorColor, {
        alpha: .7
      }),
      closeIconColorPressedError: scaleColor(errorColor, {
        alpha: .7
      }),
      closeColorHoverError: changeColor(errorColor, {
        alpha: .16
      }),
      closeColorPressedError: changeColor(errorColor, {
        alpha: .12
      })
    };
  }
};
//#endregion
export { tagDark as default };