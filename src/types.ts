export type WishType = '朋友' | '家人' | '同学' | '神秘人';

export type Wish = {
  id: string;
  nickname: string;
  message: string;
  type: WishType;
  createdAt: string;
};

export type Page = 'home' | 'hall' | 'send' | 'gift';

export type GiftCard = {
  title: string;
  blessing: string;
  wishId: string;
};
