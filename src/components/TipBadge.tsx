import type { TipType } from '../types';
import { TIP_LABEL } from '../data/content';

const title: Record<TipType, string> = {
  cognate: 'True cognate — shared form and meaning',
  near: 'Near cognate — a pattern you can reuse',
  mnemonic: 'Mnemonic only — not a real word relative',
  falseFriend: 'False friend — looks familiar, means something else',
};

export function TipBadge({ type }: { type: TipType }) {
  const tone =
    type === 'falseFriend'
      ? 'bg-warn-soft text-warn'
      : type === 'near'
        ? 'bg-de-soft text-de-deep'
        : type === 'mnemonic'
          ? 'bg-paper text-ink'
          : 'bg-es-soft text-es-deep';

  return (
    <span title={title[type]} className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {TIP_LABEL[type]}
    </span>
  );
}
