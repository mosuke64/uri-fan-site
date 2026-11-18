# GitHubアップロード＆トラブルシューティング 学習ノート
（Webサイト公開・Git操作・英語メッセージ解説）

---

## 1. 今回の全体の流れと学んだこと

### 背景と原因
* **最初の状態**: Webサイト本体のフォルダ（`uri-fan-site`）ではなく、親フォルダ（`website`）でGitが初期化されていたため、バックアップ用フォルダまでコミットされてしまっていた。
* **解決策**: 親フォルダの不要なGit設定を外し、Webサイト直下（`uri-fan-site`）で新しくきれいにGitを初期化してGitHubにアップロードし直した。

---

## 2. 実行した手順と重要コマンド

### ステップ1: WebサイトフォルダをGit管理下に置く
```powershell
# Webサイトのフォルダに移動
cd C:\Users\mosuk\Dropbox\Antigravity\website\uri-fan-site

# Gitリポジトリを新規作成
git init

# デフォルトブランチを main に設定
git branch -M main

# すべての変更ファイルを登録
git add .

# 最初のコミット（記録）を作成
git commit -m "Initial commit"
```

### ステップ2: GitHubで空のリポジトリを作成
* GitHubで **New repository** を作成。
* **Repository name**: `uri-fan-site`
* **Public**（全体公開）を選択。
* **注意点**: README、.gitignore、License のチェックはすべて **OFF（未選択）** にする（空のリポジトリにするため）。

### ステップ3: GitHubへのアップロード（プッシュ）
```powershell
# アップロード先（リモート）を登録
git remote add origin https://github.com/mosuke64/uri-fan-site.git

# GitHubへ初回アップロード
git push -u origin main
```

---

## 3. 出てきたエラー・英語メッセージの語学メモ

今回のやりとりで遭遇した英語メッセージと、その意味・使われる場面の解説です。

| 英語メッセージ | 直訳・意味 | 解説・対応方法 |
| :--- | :--- | :--- |
| **`fatal: not a git repository (or any of the parent directories): .git`** | 致命的エラー：Gitリポジトリ（または親ディレクトリのいずれか）ではありません | 今いるフォルダに `.git` がない（Git管理されていない場所でコマンドを実行した）ときに出ます。<br>👉 `cd` で正しいプロジェクトフォルダに移動すれば解決します。 |
| **`info: please complete authentication in your browser...`** | お知らせ：お使いのブラウザで認証を完了してください | GitがGitHubアカウントへのアクセス許可を求めています。<br>👉 自動で開くブラウザでログイン承認を行います。 |
| **`Authorize Git Credential Manager`** | Git資格情報マネージャーを承認する | パソコン内のGitツールが、安全にGitHubへ通信できるように権限を与える画面です。 |
| **`Enumerating objects`** | オブジェクトを一覧化（カウント）中 | アップロードするファイルや履歴をGitが整理・集計しています。 |
| **`Compressing objects`** | オブジェクトを圧縮中 | 送信データを小さく圧縮して通信を軽くしています。 |
| **`Writing objects: 100%`** | オブジェクトの書き込み：100% | GitHubサーバーへすべてのデータが送信完了したことを示します。 |
| **`branch 'main' set up to track 'origin/main'.`** | ブランチ 'main' が 'origin/main' を追跡するように設定されました | 次回以降は `git push` だけで、同じGitHubリポジトリのmainブランチに自動送信できるようになりました。 |

---

## 4. Webサイトの公開方法（GitHub Pages）
1. GitHubの `uri-fan-site` リポジトリを開く
2. **Settings**（設定） ➔ **Pages** を開く
3. **Branch** を `main` にして **Save** を押す
4. 数分後に `https://mosuke64.github.io/uri-fan-site/` で世界中に公開されます。

---
作成日: 2026-11-18
