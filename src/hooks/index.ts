import { useEffect, useRef, useState } from "react";

type ScrollingState = "idle" | "scrolling" | "scrolledLeft" | "scrolledRight";

const useHorizontalScroll = (delay = 150) => {
    const ref = useRef<HTMLDivElement>(null); // 内部创建的 ref
    const [scrollingState, setScrollingState] = useState<ScrollingState>("idle"); // 滚动状态
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 定时器
    const lastScrollLeft = useRef(0); // 保存上一次的滚动位置

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            const currentScrollLeft = element.scrollLeft;

            // 滚动中
            if (scrollingState === "idle") {
                setScrollingState("scrolling");
            }

            // 判断滚动方向
            if (currentScrollLeft > lastScrollLeft.current) {
                setScrollingState("scrolledRight");
            } else if (currentScrollLeft < lastScrollLeft.current) {
                setScrollingState("scrolledLeft");
            }

            // 更新上一次滚动位置
            lastScrollLeft.current = currentScrollLeft;

            // 清除之前的计时器
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // 设置新的计时器，延迟设置为 idle 状态
            scrollTimeoutRef.current = setTimeout(() => {
                setScrollingState("idle");
            }, delay);
        };

        // 监听滚动事件
        element.addEventListener("scroll", handleScroll);

        return () => {
            // 清理事件监听和计时器
            element.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [delay, scrollingState]);

    return { ref, scrollingState };
};

export default useHorizontalScroll;