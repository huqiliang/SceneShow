$(function(){

 CleanStorage()
	$.getJSON('/moban.json', function(json) {
		for (var i = 0; i < json.length; i++) {
			$(".tupian").append('<li><img src="'+json[i].showimg+'" width="310" height="475"></li>');
		};	
		$(".tupian li").on("click",function() {
			var SelectIndex=parseInt($(".bg_active").attr('title'));
			var index=$(this).index();
			var d = dialog({
				title:"确认信息",
				content:"页面模板会覆盖编辑区域已有组件，是否继续？",
				button: [
			        {
			            value: '确定',
			            callback: function () {
			            	AppendTo(json,index);
			            
							EditLocalStoragePage(SelectIndex,json[index])
							
			            },
			            autofocus: true
			        },
			        {
			            value: '取消'
			        }
			    ]
			});
			
			if($.trim($("#layer").html())==''){
				AppendTo(json,index);
				EditLocalStoragePage(SelectIndex,json[index])
			}else{
				d.showModal();
			}
		
	    });
	});

    $('#btn_insertPage').click(function() {
    	var len = $("#pageList li").length;
    	var index=parseInt($("#pageList li:last").attr('title'))+1;
    	var appendli='<li class="ui-state-default bg_active" title='+index+'><span class="badge showba">'+(len+1)+'</span><span class="showbn">第'+(index+1)+'页</span></li>';
    	$("#pageList").find("li").removeClass('bg_active').end().append(appendli);
    	 $(".ui-state-default").on("click",function() {
	    	$(this).addClass('bg_active').siblings().removeClass('bg_active')
	    });
    	$("#layer").html('');
		$(".nr").css("background","#fff")
    	BgActiveClick()
    });

    $(".ui-state-default").on("click",function() {
    	$(this).addClass('bg_active').siblings().removeClass('bg_active')
    });

	$('#deletePage').click(function(){
		var index = parseInt($(".bg_active").index());
		var thisPage=parseInt($(".bg_active").attr("title"))
		if (typeof ReadLocalStoragePage(thisPage)=="object"){
			var json=ReadLocalStorage();
			delete json[thisPage];
			SaveToLocalStorage(json)
		}
		$(".bg_active").remove();
	 	if($("#pageList li").eq(index).size()==0){
	 		$("#pageList li").eq(0).addClass('bg_active');
	 		var pageindex=parseInt($("#pageList li").eq(0).attr('title'))
	 		if (typeof ReadLocalStoragePage(pageindex)=="object") {
	 			AppendTo(ReadLocalStorage(),pageindex);
	 			AnimateGo(ReadLocalStorage(),pageindex)
	 		}else{
	 			$("#layer").html('');
				$(".nr").css("background","#fff")
	 		}
	 		
	 	}else{
	 		$("#pageList li").eq(index).addClass('bg_active').find('.showba').text(index+1);
	 		var $nextAll=$("#pageList li").eq(index).nextAll().find('.showba').each(function(index2,el) {
	 			$(this).text(index+index2+2)
	 		});
	 		var pageindex=parseInt($("#pageList li").eq(index).attr('title'))
	 		if (typeof ReadLocalStoragePage(pageindex)=="object") {
	 			AppendTo(ReadLocalStorage(),pageindex);
	 			AnimateGo(ReadLocalStorage(),pageindex)
	 		}else{
	 			$("#layer").html('');
				$(".nr").css("background","#fff")
	 		}
	 	}
		
		
		
	})

	function BgActiveClick(){

		$(".bg_active").on("click",function(){
			var index=parseInt($(this).attr("title"))
			var json=ReadLocalStorage();
			if (typeof json[index] != "undefined") {
				AppendTo(json,index);
				AnimateGo(json,index)
				EditText()		
			}else{
				$("#layer").html('');
				$(".nr").css("background","#fff")
			}
			
		})
	}
    BgActiveClick()
    
    // $('#pageList').sortable(function(){
    //     var liLength = $('#pageList li').length;
    //     for (var i = 1; i < liLength+1; i++) {
    //         $("#pageList li").eq(i-1).children('#paixu').text(i);
    //     };
    // });    




	$("#save").click(function() {
		console.info(ReadLocalStorage())
	});
	function AnimateGo(json,PageIndex){                     //运动方式 第N页
		//初始化载入第N页
		for (var i = 0; i < json[PageIndex]['children'].length; i++) {

			var page=json[PageIndex]['children'];

			var animate_type = page[i].animate_type,animate ={};

			var retatoZ = page[i].retatoZ;

			if(typeof retatoZ == 'undefined'){
				retatoZ=0;
			}
			
			animate[animate_type] = page[i].animate_px;
			animate["opacity"] = 1;

			var position = (page[i].animate_type=="left") ? "top" :"left";

			$(".gogo").eq(i).css({"transform":"rotateZ("+retatoZ+")","opacity":"0"})
			
			$(".gogo").eq(i).css(position,page[i].position).animate(animate,"slow")



			
		};
	}
	
	function CleanStorage(){
		SaveToLocalStorage({});
	}
	function EditLocalStorage(PageIndex,index,field,value){			//1.所属页面  2.元素下标 3.元素属性 4.修改值 
		//从localStorage取数据
		var info = ReadLocalStorage();
		info[PageIndex]['children'][index][field]=value;             //修改相应的值操作
		SaveToLocalStorage(info)
		
	}
	function EditLocalStoragePage(PageIndex,value){					//修改一个页面
		var info = ReadLocalStorage();
		info[PageIndex]=value;   		
		AnimateGo(info,PageIndex)
		EditText()	
		SaveToLocalStorage(info)

	}
	function ReadLocalStoragePage(PageIndex){						//读取一个页面
		var info = ReadLocalStorage();
		return info[PageIndex];          
	}

	function SaveToLocalStorage(info){
		var data = JSON.stringify(info);		//将JSON对象转化成字符串
		localStorage.setItem("data",data);		//用localStorage保存转化好的的字符串
	}
	function ReadLocalStorage(){
		var json = localStorage.getItem("data");        
		json = $.parseJSON(json)
		return json;
	}


	function EditText(){
		$(".gogo span").on('blur',function() {
			var index=parseInt($(this).parent().parent().attr("title"))
		
			var PageIndex=parseInt($("#pageList .bg_active .badge").text())-1;
			
			EditLocalStorage(PageIndex,index,"content",$(this).html())  //1.所属页面  2.元素下标 3.元素属性 4.修改值 

		});
	}

	function AppendTo(json,index){
		var Children=json[index]['children'];
		var NormalHTML='';
		for (var i = 0; i < Children.length; i++) {
			if(Children[i].type=="text"){
				truecontent='<span  contenteditable="true" class="editor">'+Children[i].content+'</span>';
			}else if(Children[i].type=="img"){
				truecontent="<img class='upload' src="+Children[i].content+" width="+Children[i].width+" height="+Children[i].height+"/>";
			}
			
			NormalHTML+='<li id="inside_'+(i+1)+'" title="'+i+'" class="gogo" style="z-index:1; ">'
	          +'<div class="box" style="width: 100%; height: 100%;">'+truecontent+'</div>'
	        
	        +'</li>';

	      
		};
		$(".nr").css({
			"background":"url("+json[index].background+") 50% 50%",
			"background-color":""+json[index].bgColor,
			"backgroundSize":"cover",
			"text-align":json[index].float
		})
		$(".scene_title_baner").text(json[index].title)
		$("#layer").html('').append(NormalHTML);
		$(".editor").popline();
		$('#layer li').click(function(){
			//$(this).attr('title',"1").siblings().attr('title',"0")
			var html= '<div class="revolve bar-rotate"></div><div class="bar-line"></div>'
			$(this).append(html).resizable({ 
		        handles: 'all',
		    }).draggable({ 
		        containment: ".nr", 
		        scroll: false,
		        cancel: "span",
		        stop:function(){

		        	var thisindex=$(this).index();
		        	var PageIndex=parseInt($(".bg_active").attr('title'));
		        	var pleft=$(this).css("left");
		        	var ptop=$(this).css("top");
		        	
		        	if(Children[thisindex].animate_type=="top"){
		        		EditLocalStorage(PageIndex,thisindex,"animate_px",ptop)  //1.所属页面  2.元素下标 3.元素属性 4.修改值
		        		EditLocalStorage(PageIndex,thisindex,"position",pleft)  //1.所属页面  2.元素下标 3.元素属性 4.修改值
		        	}else{
		        		EditLocalStorage(PageIndex,thisindex,"animate_px",pleft)  //1.所属页面  2.元素下标 3.元素属性 4.修改值
		        		EditLocalStorage(PageIndex,thisindex,"position",ptop)  //1.所属页面  2.元素下标 3.元素属性 4.修改值
		        	}
		        }
		    }).find('.ui-resizable-handle').show()
		    $(this).siblings().find('.revolve').remove().end().find('.bar-line').remove().end().find('.ui-resizable-handle').hide()
		})

		
	    $('#layer li .revolve').mousedown(function(e){
	        var isRevolve = true;
	        var layerLi = $(this).parent(); 
	        var revolve_x = layerLi.offset().left + layerLi.width()/2;  
	        var revolve_y = layerLi.offset().top + layerLi.height()/2;
	        var index = layerLi.index();
	        var PageIndex = parseInt($(".bg_active").attr('title'));
	        $(document).mousemove(function(event){
	            var x = event.pageX-revolve_x;
	            var y = event.pageY-revolve_y;
	            var jd = Math.atan2(y,x)/Math.PI*180+90;
	            if (isRevolve){
	                layerLi.css({'-moz-transform':'rotateZ('+jd+'deg)','-webkit-transform':'rotateZ('+jd+'deg)','-o-transform':'rotateZ('+jd+'deg)','transform':'rotateZ('+jd+'deg)'}); 
	            	EditLocalStorage(PageIndex,index,"retatoZ",jd+"deg")  //1.所属页面  2.元素下标 3.元素属性 4.修改值
	            }
	        }).mouseup(function(){ 
	            isRevolve = false;  
	        });
	        e.stopPropagation();    
	    });  
	   $(".upload").on("click",function(){
	   		uploadImg()
	   })
	}
	function uploadImg(){
		$("#UpImg").modal('show')
	}
    $("#beijing_bj").on("click",function(){
   		uploadImg()
    })
     $("#beijing_del").on("click",function(){
   		 EditBg('')
    })
    function EditBg(value){
    	var index=parseInt($(".bg_active").attr("title"))
    	var jsonPage=ReadLocalStoragePage(index)
    	if(typeof jsonPage!="undefined"){
    		var json=ReadLocalStorage()
    		json[index].background = value
    		SaveToLocalStorage(json)
    	}
    	$(".nr").css("background","")
    }
   
})