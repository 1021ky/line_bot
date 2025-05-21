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
