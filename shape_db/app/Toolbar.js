

example.Toolbar = Class.extend({
	//example.Toolbar クラスを定義
	
	init:function(elementId, view)
	// 初期化関数
    // elementId: ツールバーを表示するHTML要素のID
    // view: ツールバーが関連付けられるビューオブジェクト
	{
		this.html = $("#"+elementId); // HTML要素を取得し、this.htmlに格納
		this.view = view; // ビューオブジェクトを格納
		
		
		view.getCommandStack().addEventListener(this);
        // キャンバスのCommandStackにこのクラスをイベントリスナーとして登録
        // これは、Undo/Redoボタンの状態を更新するために必要
		
        view.on("select", $.proxy(this.onSelectionChanged,this));
		//// Deleteボタンの状態を制御するための選択リスナーを登録
		
		//UNDOボタンとコールバック関数をツールバーに追加
		this.undoButton  = $("<button class='gray'>Undo</button>");
		this.html.append(this.undoButton);  // ツールバーにボタンを追加
		this.undoButton.click($.proxy(function(){
		    //undoボタンがクリックされた時の処理
		    this.view.getCommandStack().undo(); // コマンドを元に戻す
		},this));

		//// REDOボタンとコールバック関数をツールバーに追加
		this.redoButton  = $("<button class='gray'>Redo</button>");
		this.html.append(this.redoButton);// ツールバーにボタンを追加
		this.redoButton.click($.proxy(function(){
			// REDOボタンがクリックされた時の処理
		    this.view.getCommandStack().redo(); // コマンドを再実行
		},this));
		
		//ツールバーにデリミタ（区切り線）を追加
		this.delimiter  = $("<span class='toolbar_delimiter'>&nbsp;</span>");
		this.html.append(this.delimiter);

		// DELETEボタンとコールバック関数をツールバーに追加
		this.deleteButton  = $("<button class='gray'>Delete</button>");
		this.html.append(this.deleteButton); // ツールバーにボタンを追加
		this.deleteButton.click($.proxy(function(){
			// DELETEボタンがクリックされた時の処理
			var node = this.view.getPrimarySelection(); // 選択された要素を取得
			var command= new draw2d.command.CommandDelete(node); // 削除コマンドを作成
			this.view.getCommandStack().execute(command); // コマンドを実行
		},this));
		
		// 初期状態でUNDO、REDO、DELETEボタンを無効に
        this.disableButton(this.undoButton, true); 
        this.disableButton(this.redoButton, true);
        this.disableButton(this.deleteButton, true);
        
		// ツールバーにヒントメッセージを追加
        this.html.append($("<div id='toolbar_hint'>右クリックでラベルが追加される</div>"));
    },

	/**
	 * @method
	 * Called if the selection in the cnavas has been changed. You must register this
	 * class on the canvas to receive this event.
	 *
	 * @param {draw2d.Canvas} emitter
	 * @param {Object} event
	 * @param {draw2d.Figure} event.figure
	 */
    //onSelectionChanged メソッド:選択が変更されたときに呼び出される関数
	//emitter：イベントの発信元を表す。この場合はキャンバスやビューオブジェクトが発信元
	//event：イベントオブジェクト。選択に関連する情報を含んでいる
	//このメソッドの主な役割は、this.deleteButton というボタンを制御し、選択された要素が存在する場合にボタンを有効にし、
	//選択された要素が存在しない場合にボタンを無効にすること
	onSelectionChanged : function(emitter, event)
	{
        this.disableButton(this.deleteButton,event.figure===null );
	    //this.disableButton メソッド:ボタンを有効または無効にするためのユーティリティ関数
		//this.deleteButton:Deleteボタンを表す変数
		//event.figure === null:選択された要素 (event.figure) が存在しない場合に true を返し、存在する場合に false を返す
	},
	
	/**
	 * @method
	 * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail() 
	 * can be used to identify the type of event which has occurred.
	 * 
	 * @template
	 * 
	 * @param {draw2d.command.CommandStackEvent} event
	 **/
	//stackChanged メソッド:コマンドスタック（Undo/Redoの履歴を管理するオブジェクト）の状態が変化したときに呼び出される関数
	//UndoボタンとRedoボタンをコントロールし、コマンドスタックがUndoおよびRedoを実行できるかどうかに応じてこれらのボタンを有効または無効に
	stackChanged:function(event)
	{
		//this.disableButton メソッド:ボタンを有効または無効にするためのユーティリティ関数
        this.disableButton(this.undoButton, !event.getStack().canUndo());
        this.disableButton(this.redoButton, !event.getStack().canRedo());
	},
	
	disableButton:function(button, flag)
	//disableButton メソッド:button と flag,2つのパラメーターを受け取っている
	{
	   button.prop("disabled", flag); // ボタンの disabled 属性を設定

       if(flag){
            button.addClass("disabled"); // ボタンに "disabled" クラスを追加
        }
        else{
            button.removeClass("disabled"); // ボタンから "disabled" クラスを削除
        }
	}
	//この関数を使用することで、ボタンの無効化および有効化を簡単に切り替えている
});

//ここより先はLabelDiamond関連のコード

		let MyInputPortLocator = draw2d.layout.locator.PortLocator.extend({
        //draw2d.layout.locator.PortLocator クラスを拡張してMyInputPortLocator というカスタムポート配置クラスを定義
			init:function( ){
			// 初期化関数
			//このクラスのインスタンスを作成する際に実行される
			this._super(); // 親クラスの初期化関数を呼び出す
			},
			relocate:function(index, figure){
		    // ポートの配置を行う関数
			// この関数は、ポートをどの位置に配置するかを決定する
				this.applyConsiderRotation(figure, figure.getParent().getWidth()/2, 0);
			    //figure.getParent().getWidth()/2, 0):特定の図形内のポートの配置を行うためのコード
				//このコードは、図形内のポートを水平方向に中央に配置する役割を果たす
				//figure：ポートを配置する対象の図形
				//figure.getParent().getWidth() / 2：親図形の幅の半分の位置にポートを配置
				//figure.getParent()：ポートを含む図形の親を取得
				//getWidth()：親図形の幅を取得
				//getWidth() / 2：親図形の幅の半分の位置を計算
				//これにより、ポートが水平方向に中央に配置される
			}
		});


		let MyOutputPortLocator = draw2d.layout.locator.PortLocator.extend({
			init:function( ){
			this._super();
			},
			relocate:function(index, figure){
				var p = figure.getParent();
				//p: ポートの親となる図形を取得

				this.applyConsiderRotation(figure, p.getWidth()/2, p.getHeight());
			}
		});

		let topPort;
		let borromPort;
		let leftPort;
		let rightPort;



//DabelDiamondの詳細
LabelDiamond = draw2d.shape.basic.Diamond.extend({
    //LabelDiamond というカスタム形状クラスを定義

	NAME: "LabelDiamond",
    //インスタンスが初期化されるときに呼び出されるコンストラクタ関数を定義
	
    init : function(elementId, view)
	    // コンストラクタ関数を定義
        // elementId: HTML 要素の ID 。この ID を持つ HTML 要素内に形状を描画
        // view: ビューオブジェクト。形状が表示されるキャンバスを指定
    {   	
        //// HTML 要素の取得とビューオブジェクトの設定
		this.html = $("#"+elementId);
		this.view = view;
		
		// ラベルの作成
		this.label = new draw2d.shape.basic.Label({ text: "選択肢", color: "transparent", fontColor: "#0d0d0d" });
        this.add(this.label, new draw2d.layout.locator.CenterLocator(this));
        this.label.installEditor(new draw2d.ui.LabelInplaceEditor());

		// 上部ポートを作成
		topPort = this.createPort("output", new draw2d.layout.locator.TopLocator(this));
		topPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定

		// 下部ポートを作成
		bottomPort = this.createPort("output", new draw2d.layout.locator.BottomLocator(this));
		bottomPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定

		// 左部ポートを作成
		leftPort = this.createPort("output", new draw2d.layout.locator.LeftLocator(this));
		leftPort.setBackgroundColor("#0000FF"); // ポートの背景色を設定

		// 右部ポートを作成
		rightPort = this.createPort("output", new draw2d.layout.locator.RightLocator(this));
		rightPort.setBackgroundColor("#0000ff"); // ポートの背景色を設定

	    // コマンドスタックの変更イベントをリスン
		view.getCommandStack().addEventListener(this);
		
		// ADD LabelDiamond ボタンの挿入
        this.addLabelDiamondButton = $("<button class='gray'>Add LabelDiamond</button>");
        //"Add LabelDiamond" という要素を持つグレーのボタンを作成 
		this.html.append(this.addLabelDiamondButton);
		//ボタンをツールバー(this.html)内に追加
        this.addLabelDiamondButton.click($.proxy(function () {
            // LabelDiamond の新しいインスタンスを作成し、キャンバスに追加
            var labelDiamond = new LabelDiamond({ x: 50, y: 50, width: 100, height: 100 }); // 位置とサイズを調整
            //新しい LabelDiamond インスタンスを作成
			//新しい図形の位置（x: 50、y: 50）とサイズ（width: 100、height: 100）が指定されている
			this.view.add(labelDiamond);
			//新しい LabelDiamond インスタンスをキャンバスビュー (this.view) に追加
			//ユーザーがボタンをクリックすると、キャンバス上に新しい LabelDiamond 図形が追加される
        }, this));
 
    },
});