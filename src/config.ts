export type Config = {
    lineChannelSecret: string;
    // 他の設定値もここに追加可能
};

export const config: Config = {
    lineChannelSecret: process.env.LINE_CHANNEL_SECRET ?? '',
    // 他の設定値も同様に process.env.XXX ?? ''
};
