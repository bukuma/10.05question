// example という名前の名前空間を宣言し、example.Application クラスを定義
//名前空間:関連するクラスやオブジェクトをグループ化し、衝突を避けるための有用な方法

let example = {};
//変数 example は空のオブジェクト（{}）で初期化されている

/**
 * 
 *GraphicalEditor：レイアウトとダイアログ処理を担当する 
 * @author Andreas Herz
 * @extends draw2d.ui.parts.GraphicalEditor
 */
//グラフィカルエディタのアプリケーションをセットアップし、
//キャンバスビューとツールバーを関連付けて、ユーザーが図形を作成および編集できる環境を提供する
example.Application = Class.extend(
    //example.Application クラスは、グラフィカルエディタのアプリケーションを定義する
    //これは特定のタスクや機能を実行するためのコードをまとめたもので、アプリケーション全体を制御する
{
    NAME : "example.Application",
    //NAME プロパティには、クラスの名前（"example.Application"）が設定されている
    // これはクラスの識別子として使用される

    /**
     * @constructor
     * 
     * @param {String} canvasId :ペイントコンテナとして使用するDOM要素のID
     */
    init : function()
    //init コンストラクタでアプリケーションの初期化
    {
	      this.view    = new example.View("canvas");
          // キャンバスのビューを作成
          //DOM要素のIDが "canvas" の要素をペイントコンテナとして使用
          this.toolbar = new example.Toolbar("toolbar",  this.view );
	      // ツールバーを作成し、キャンバスビューを関連付ける
          //ツールバー:ユーザーがグラフィカルエディタ内で使用するツールやオプションを提供するためのUIコンポーネント
    }


});