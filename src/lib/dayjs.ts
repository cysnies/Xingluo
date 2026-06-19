import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

/** 集中加载 dayjs 插件，避免各处重复加载 */
dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;
export { dayjs };
