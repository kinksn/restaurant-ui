// メニューページ一覧のデータ
export type MenyType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

// 商品の型定義
export type ProductType = {
  id: string;
  title: string;
  desc: string;
  img?: string;
  price: number;
  // プロジェクトでは製品詳細ページ（/product/${id} でoptionsを使ってサイズのバリエーションを表現している
  // 例）{"title":"midium","additionalPrice":2}, {"title": "large"...}
  options?: { title: string, additionalPrice: number }[]; 
  catSlug?: string;
};

// 注文の型定義
export type OrderType = {
  id: string;
  price: number;
  products: CartItemType[];
  status: string; // 注文の状態（例：「発送済み」、「処理中」など）
  createdAt: Date;
  userEmail: string;
  intent_id?: String; // 支払い処理に関連するID
}

// カート内商品の型定義
export type CartItemType = {
  id: string;
  title: string;
  img?: string;
  price: number;
  optionTitle?: string; // pizzaでやってる「midium」「lagrge」のオプションなど
  quantity: number;
};

// カートの型定義
export type CartType = {
  products: CartItemType[]; // カート内の製品リスト
  totalItems: number;
  totalPrice: number;
};

// カートの状態を変更する関数の型定義（stateを更新するdispatcherの定義）
export type ActionTypes = {
  addToCart: (item:CartItemType) => void;
  removeFromCart: (item:CartItemType) => void;
}