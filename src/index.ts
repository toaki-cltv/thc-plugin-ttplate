import { createThcPlugin, type ThcPlugin } from "@thcjs/core/plugins";

export interface TitleTemplatePluginOptions {
  rank?: number;
  template?: string;
  siteName?: string;
  separator?: string;
  skipWhenSingleTitle?: boolean;
}

export const thcTitleTemplate = (options: TitleTemplatePluginOptions = {}): ThcPlugin =>
  createThcPlugin({
    name: "tv.tkcl.thc.title-template",

    transform(head, advanced) {
      const c = {
        rank: options.rank ?? 0,
      }

      // ランクと一致するルートを取得
      const rankRoute = [...advanced.router].reverse().find((d) => d.index === c.rank);

      // 現在のルートを取得
      const currentRoute = [...advanced.router].reverse().find((d) => d);

      const title = head.meta?.find((m) => Boolean(m?.title))?.title;

      let formattedTitle = title;

      // もし、ランクと現在のルートが同じランクではないのなら
      // もしランクが異なるかつ、パスが異なるのなら、タイトルを変更する
      if (c.rank !== currentRoute?.index && rankRoute?.pathname !== currentRoute?.pathname) {
        formattedTitle = options.template
          ? options.template.replace('%s', title ?? "")
          : `${title}${options.separator ?? " | "}${options.siteName ?? "App"}`;
      }

      return {
        ...head,
        meta: [
          ...(head.meta ?? []),
          {
            title: formattedTitle
          }
        ],
      };
    },
  });
