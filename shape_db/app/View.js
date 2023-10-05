//ビューは、図形や要素を描画し、操作するためのキャンバスを提供する

example.View = draw2d.Canvas.extend({
    //// example.View クラスを定義
	
	init:function(id)
        // 初期化関数
        // id: キャンバスを表示する HTML 要素の ID
    {
		this._super(id, 4000,4000);
		// 親クラスの初期化関数（draw2d.Canvas のコンストラクタ）を呼び出す
        // この際、キャンバスの幅と高さを 4000x4000 に設定

		this.setScrollArea("#"+id);
        // キャンバスのスクロール領域を指定された HTML 要素（ID で指定）に設定
	},

    
    /**
     * @method
     * ユーザーが droppedDomNode（ドラッグアンドドロップされた DOM 要素）をキャンバス上にドロップしたときに呼び出されるメソッドです。
     * Draw2D は jQuery の draggable/droppable ライブラリを使用しています。詳細については、以下のリンクを参照してください。
     * http://jqueryui.com/demos/droppable/
     * 
     * @param {HTMLElement} droppedDomNode :ドロップされた DOM 要素
     * @param {Number} x :ドロップの x 座標
     * @param {Number} y :ドロップの y 座標
     * @param {Boolean} shiftkey :イベント中に Shift キーが押されている場合は true
     * @param {Boolean} ctrlKey :イベント中に Ctrl キーが押されている場合は true
     **/
    //ドラッグアンドドロップ操作に応答するための onDrop メソッドを示している
    //このメソッドは、特定のDOM要素（droppedDomNode）がキャンバス上にドロップされたときに呼び出される
    onDrop : function(droppedDomNode, x, y, shiftKey, ctrlKey)
    {
        let type = $(droppedDomNode).data("shape");
        // ドロップされた要素の種類を取得
        let figure = eval("new "+type+"();");
        // ドロップされた要素の種類に基づいて新しい図形オブジェクトを作成
        // droppedDomNode パラメータから、ドロップされた要素の種類（type）を取得
        
        figure.addEntity("id");
        // 図形にエンティティ（ここでは "id"）を追加
        figure.setName("NewTable");
        // 図形に名前を設定（ここでは "NewTable"）
        
        
        let command = new draw2d.command.CommandAdd(this, figure, x, y);
        // 図形をキャンバスに追加するためのコマンドを作成
        this.getCommandStack().execute(command);
        // コマンドを実行して、図形をキャンバスに追加
    }
});
