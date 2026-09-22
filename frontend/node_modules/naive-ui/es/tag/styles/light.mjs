import derived from "../../_styles/common/light.mjs";
import _common_default from "./_common.mjs";
import { changeColor } from "seemly";
//#region src/tag/styles/light.ts
function self(vars) {
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
    opacityDisabled,
    tagColor,
    closeIconColor,
    closeIconColorHover,
    closeIconColorPressed,
    borderRadiusSmall: borderRadius,
    fontSizeMini,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    heightMini,
    heightTiny,
    heightSmall,
    heightMedium,
    closeColorHover,
    closeColorPressed,
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
    colorBordered: "rgb(250, 250, 252)",
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
      alpha: .12
    }),
    colorBorderedPrimary: changeColor(primaryColor, {
      alpha: .1
    }),
    closeIconColorPrimary: primaryColor,
    closeIconColorHoverPrimary: primaryColor,
    closeIconColorPressedPrimary: primaryColor,
    closeColorHoverPrimary: changeColor(primaryColor, {
      alpha: .12
    }),
    closeColorPressedPrimary: changeColor(primaryColor, {
      alpha: .18
    }),
    borderInfo: `1px solid ${changeColor(infoColor, {
      alpha: .3
    })}`,
    textColorInfo: infoColor,
    colorInfo: changeColor(infoColor, {
      alpha: .12
    }),
    colorBorderedInfo: changeColor(infoColor, {
      alpha: .1
    }),
    closeIconColorInfo: infoColor,
    closeIconColorHoverInfo: infoColor,
    closeIconColorPressedInfo: infoColor,
    closeColorHoverInfo: changeColor(infoColor, {
      alpha: .12
    }),
    closeColorPressedInfo: changeColor(infoColor, {
      alpha: .18
    }),
    borderSuccess: `1px solid ${changeColor(successColor, {
      alpha: .3
    })}`,
    textColorSuccess: successColor,
    colorSuccess: changeColor(successColor, {
      alpha: .12
    }),
    colorBorderedSuccess: changeColor(successColor, {
      alpha: .1
    }),
    closeIconColorSuccess: successColor,
    closeIconColorHoverSuccess: successColor,
    closeIconColorPressedSuccess: successColor,
    closeColorHoverSuccess: changeColor(successColor, {
      alpha: .12
    }),
    closeColorPressedSuccess: changeColor(successColor, {
      alpha: .18
    }),
    borderWarning: `1px solid ${changeColor(warningColor, {
      alpha: .35
    })}`,
    textColorWarning: warningColor,
    colorWarning: changeColor(warningColor, {
      alpha: .15
    }),
    colorBorderedWarning: changeColor(warningColor, {
      alpha: .12
    }),
    closeIconColorWarning: warningColor,
    closeIconColorHoverWarning: warningColor,
    closeIconColorPressedWarning: warningColor,
    closeColorHoverWarning: changeColor(warningColor, {
      alpha: .12
    }),
    closeColorPressedWarning: changeColor(warningColor, {
      alpha: .18
    }),
    borderError: `1px solid ${changeColor(errorColor, {
      alpha: .23
    })}`,
    textColorError: errorColor,
    colorError: changeColor(errorColor, {
      alpha: .1
    }),
    colorBorderedError: changeColor(errorColor, {
      alpha: .08
    }),
    closeIconColorError: errorColor,
    closeIconColorHoverError: errorColor,
    closeIconColorPressedError: errorColor,
    closeColorHoverError: changeColor(errorColor, {
      alpha: .12
    }),
    closeColorPressedError: changeColor(errorColor, {
      alpha: .18
    })
  };
}
const tagLight = {
  name: "Tag",
  common: derived,
  self
};
//#endregion
export { tagLight as default };