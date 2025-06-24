# line_bot

LINE Messaging APIを使ったLINE Bot

## システム構成

以下の3つのコンポーネントで構成されています。

* LINE Messaging API Webhookイベントを受け取るサーバー(Cloud Run Functions)
* Cloud Pub/Sub
* Bot(Cloud Run Functions)

## 各コンポーネントの処理概要

* LINE Messaging API Webhookイベントを受け取るサーバー(Cloud Run Functions)
  * メッセージの署名確認
  * イベントの判別
  * イベントごとにCloud Pub/Subにメッセージを送信
* Cloud Pub/Sub
  * LINE Messaging API Webhookイベントを受け取るサーバーからのメッセージを受け取る
  * Cloud Functionsにメッセージを送信
* Bot(Cloud Run Functions)
  * Cloud Pub/Subからのメッセージを受け取る
  * LINE Messaging APIにメッセージを送信

## テスト方針

### 単体テスト

* 各コンポーネントの単体テストは必ず書く
* * exportされている関数とクラスをテストする
* * exportされている関数とクラスのメソッドはカバレッジ100%を目指す
* * プライベートな関数やクラスのメソッドはテストしない
* モックやスパイの使い方のポリシー
* * アプリケーションが依存している外部サービスや境界の部分のみモックやスパイを使用する
* * 外部サービスの例: 依存している外部サービス(APIやデータベースなど)
* * 境界の部分の例: 依存ライブラリの呼び出し箇所や標準出力

### 結合テスト

TODO: 署名したイベントを作って送れるようにする。

* 対応しているイベントは全種類1回ずつ実際に送信し、Botの動作を確認する
* * イベントの内容に応じた動作確認は単体テストで行う
