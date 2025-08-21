import React from "react";
import type { ReactNode, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
  useControls
} from "react-zoom-pan-pinch";
export { KeepScale, useControls } from "react-zoom-pan-pinch";
import "./ZoomPanPinch.scss";
import { useEventListener } from "ahooks";

const TransformComponentBox = ({
  children,
  wrapperStyle,
}: {
  children?: ReactNode;
  wrapperStyle?: React.CSSProperties;
}) => {
  const control = useControls();

  // 监听窗口变化
  useEventListener("resize", () => {
    setTimeout(() => {
      control.resetTransform();
    }, 0);
  });


  return (
    <TransformComponent
      wrapperStyle={{ width: "100%", height: "100%", ...wrapperStyle }}
    >
      {children}
    </TransformComponent>
  );
};

export const ZoomPanPinch = ({
  backgroundPic,
  children,
  transformWrapper,
  wrapperStyle,
}: {
  backgroundPic: string;
  children?: ReactNode;
  transformWrapper?: typeof TransformWrapper;
  wrapperStyle?: React.CSSProperties;
}) => {
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [minScale, setMinScale] = useState<number>(getMinScale());
  const [isWidthOverflow, setIsWidthOverflow] = useState<boolean>(false);

  /**
   * 处理窗口大小变化事件，调整图片缩放比例
   * 功能：根据图片是否溢出屏幕（宽度或高度）来设置CSS变量`--img-scale`，该变量用于控制图片的缩放比例。
   *       同时根据溢出情况设置状态`isWidthOverflow`，该状态用于决定图片的填充方式（宽度填充或高度填充）。
   * 参数：无
   * 返回值：无
   */
  const handleResize = (e: any) => {
    // 调用setImgOverFlowScreen函数获取图片的溢出信息和缩放比例
    const overFlowScreen = setImgOverFlowScreen(imageRef.current);
    // 根据当前图片是否溢出宽度和高度来设置对应的变量名
    if (overFlowScreen) {
      setMinScale(overFlowScreen.minScale); // 设置最小缩放比例

      // 情况1：宽度溢出而高度不溢出
      if (
        overFlowScreen.isWidthOverflowScreen &&
        overFlowScreen.isHeightOverflowScreen === false
      ) {
        setIsWidthOverflow(false); // 设置状态为false，表示高度方向没有溢出
        // 设置CSS变量为高度方向的缩放比例（y_scale）
        document.documentElement.style.setProperty(
          "--img-scale",
          overFlowScreen.y_scale.toString()
        );
      }
      // 情况2：高度溢出而宽度不溢出
      else if (
        overFlowScreen.isWidthOverflowScreen === false &&
        overFlowScreen.isHeightOverflowScreen
      ) {
        setIsWidthOverflow(true); // 设置状态为true，表示宽度方向没有溢出
        // 设置CSS变量为宽度方向的缩放比例（x_scale）
        document.documentElement.style.setProperty(
          "--img-scale",
          overFlowScreen.x_scale.toString()
        );
      }
      // 情况3：两个方向都溢出或都不溢出（取最大缩放比例）
      else {
        // 取宽度和高度方向缩放比例的最大值，确保图片完全覆盖屏幕
        document.documentElement.style.setProperty(
          "--img-scale",
          Math.max(overFlowScreen.x_scale, overFlowScreen.y_scale).toString()
        );
      }
    }
  };

  // 监听窗口变化
  useEventListener("resize", handleResize);

  useEffect(() => {
    imageRef.current?.addEventListener("load", handleResize);
    return () => {
      imageRef.current?.removeEventListener("load", handleResize);
    };
  }, [imageRef.current]);

  const setImgOverFlowScreen = (img: HTMLImageElement | null) => {
    if (!img) return;

    // 获取图片实际渲染尺寸
    const { width: imgWidth, height: imgHeight } = img.getBoundingClientRect();

    // 获取当前视口尺寸
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 检查图片是否在宽度/高度方向溢出视口
    const isWidthOverflow = imgWidth >= viewportWidth;
    const isHeightOverflow = imgHeight >= viewportHeight;

    // 计算基于设计稿(1920x1080)的视口缩放比例
    return {
      isWidthOverflowScreen: isWidthOverflow,
      isHeightOverflowScreen: isHeightOverflow,
      x_scale: viewportWidth >= 1920 ? viewportWidth / 1920 : 1,
      y_scale: viewportHeight >= 1080 ? viewportHeight / 1080 : 1,
      minScale: getMinScale(1920, 1080),
    };
  };
  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={minScale}
      initialPositionX={0}
      initialPositionY={0}
      minScale={minScale} // 最小缩放限制
      maxScale={10} // 最大缩放限制
      disablePadding={true} // 禁用平移、缩放边界填充效果,不会拖动出边界
      {...transformWrapper}
    >
      <TransformComponentBox
        wrapperStyle={wrapperStyle}
      >
        {/* 地图内容（例如 SVG、Canvas 或图片） */}
        <div>
          <img
            ref={imageRef}
            src={backgroundPic}
            className={`fill${isWidthOverflow ? "W" : "H"}`}
          />
        </div>
        {children}
      </TransformComponentBox>
    </TransformWrapper>
  );
};

/**
 * 计算图片在视口中适应所需的最小缩放比例
 *
 * 功能描述：
 * 根据图片原始尺寸和当前视口尺寸，计算图片在视口中完全显示所需的最小缩放比例。
 * 当视口尺寸大于图片尺寸时不需要缩放（返回1），否则计算两种适应方式的最小缩放比例：
 * 1. 覆盖模式：图片完全覆盖视口所需的最小放大比例
 * 2. 包含模式：图片完全适应视口所需的最小缩小比例
 * 最终取两者中的较小值作为最小缩放限制
 *
 * @param imgWidth 图片原始宽度（默认1920）
 * @param imgHeight 图片原始高度（默认1080）
 * @returns 最小缩放比例（>=1表示放大，<1表示缩小）
 */
export function getMinScale(imgWidth = 1920, imgHeight = 1080) {
  // 服务端渲染或无window对象时直接返回1（不缩放）
  if (isServerSide() || typeof window === "undefined") return 1;

  // 获取当前视口尺寸（使用window.innerWidth和window.innerHeight，包括滚动条）
  const [vw, vh] = [window.innerWidth, window.innerHeight];

  // 视口尺寸大于图片尺寸时不需要缩放
  if (vw >= imgWidth || vh >= imgHeight) return 1;

  // 计算图片适应视口所需的最小缩放比例：
  // 1. 覆盖模式：图片完全覆盖视口所需的最小放大比例（取宽高比例中的较大值）
  const coverScale = Math.max(imgWidth / vw, imgHeight / vh);

  // 2. 包含模式：图片完全适应视口所需的最小缩小比例（取宽高比例中的较大值）
  const containScale = Math.max(vw / imgWidth, vh / imgHeight);

  // 取两者较小值作为最终的最小缩放限制
  const minScale = Math.min(coverScale, containScale);

  return minScale;
}
/**
 * 判断是否处于服务器端渲染环境。
 *
 * @returns {boolean} - 如果处于服务器端渲染环境，则返回 true，否则返回 false。
 */
const isServerSide = () => typeof window === "undefined";