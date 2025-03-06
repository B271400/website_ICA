## Website Objectives



## Technology stack

页面的设计通过CANVA网站实现，绝大多数插图均来自该网站。部分插图来自Pixabay (详情见 credit 部分)，HTML was used for the basic structure of web page。

css was used to create the style of web pages. hover和click时的动画基本都是自己用css的keyframe制作，部分结合了JS。打开页面的动画基本来自于 Animate.css这个动画库。字体是moreSugar 和gangalin , 上传了自己的字体文件保存在fonts文件夹下，并通过@font-face在tool.css文件中引入，在页面中通过classname实现字体更改。search icon是下载好了ttf字体文件，以iconfont的方式在tool.css文件引入。部分插图被整合成了一张sprite 图，通过在tool.css中设置classname的方式作为引入，这样页面只用加载一张图，节省了流量。所有的图片都保存在imgs文件夹下。mp4视频为手动录屏并用Capcut剪辑，存于videos文件夹下。CSS 文件中的base.css用于清除所有默认样式，保存了整个网站常用的颜色为变量。tool.css保存了字体，iconfont还有sprite 图的设置。banner.css也是一个共用css文件，比如search，history，analysis等界面均用了这个banner样式。其他的css文件多数为各个页面独有的。success_failure是用于search page和history page成功和失败情况样式的。analysis-detail.css是通用于三种analysis的页面的。

JavaScript was used to communicate with PHP and produce other functions. 比如，JS 实现了动态切换效果。index 页面的help 部分，analysis 页面，用户鼠标hover对应标签就可以切换标签样式并且修改介绍内容，这通过mouseenter DOM事件实现，并且运用了事件冒泡， 修改CSS 类名等技术。这个内容被封装到contentChange.js 文件中，并通过export default导到各个页面自己的js文件中。analysis 页面的轮播图也是使用了javascript和css的transform结合的方式实现。Javascript同时还负责对用户输入的内容进行第一次检查，比如searching page中，Js会通过用户是否输入内容，而决定是否把数据发送给后端。如果用户并没有输入protein name或者species name，js会给用户提示（通过click事件）并且不提交数据。

js也会实时更新页面，比如在和后端交互的过程中会把页面修改成loading样式，获取到结果以后会改成展示结果。这里和后端通信用的是fetch，基于promise对象封装好的工具。这个fetch类似于AJAX，但是因为用的是promise，比AJAX封装性要更好一些，并且这个fetch会自动处理json格式的返回数据，不需要二次处理。这里所有的请求均用的post方法，在body中携带数据。数据格式同一用new formData包装，这样不会有json格式和application/www-form格式不同的问题，php那边可以通过$_POST同一接收。即使是input 标签的数据也通过fetch发送而不是表单提交，因为这样数据可以实时更新，页面不用刷新，可以添加样式，也更方便处理错误。通过判断返回的结果中的status，针对error情况js会抛出error，并在catch部分同一处理。由于需要在用户上传文件后，或者通过tracking id查询到文件成功后，直接进行下一步分析，比如conservation plot，这里使用了await和async解决异步问题。比如用户上传完文件以后，根据文件是否上传成功判断是否给负责analysis的php文件发送数据。如果不使用async，判断会先于上传文件通信返回的结果，则无法正确输出。所有的页面的js代码均被单独拆分到js文件中并保存于js文件夹下。它们通过 `<script type="module" src="./js/xx.js"></script>`方式引入到html文件中。

php用于获取js发送到后端的数据，php通过$_POST获取了结果以后，如果是用户输入的，会通过escapeshellarg进行防注入处理，然后通过 `exec`调用python文件 并给python传递数据。python print的结果会返回给php，php通过判断python数据的状态码来决定返回给js的结果，结果均用

$response 保存为数组并用json_echo封装成json格式发送给js，方便js直接解析json格式转换为对象形式。对于上传文件和用户输入seq-id这部分，在成功以后会把成功的消息返回给js，并且直接把生成的unique-id保存在session中，这样用于analysis的php文件比如conservation.php可以直接通过session获取unique id，不用麻烦js传输，js只需要发送请求即可。 在search的时候，查询到了结果会给该查询文件创建一个unique id并用php的pdo把结果保存到数据库中。三种analysis的时候，成功了也会把结果保存到数据库中。上传文件的时候也是会创建一个unique id。history track部分就可以通过这个id来查询结果。在analysis部分，如果用户选择输入id，会先用该id在数据库中查询之前有没有进行该分析，如果有，直接返回文件路径，则不需要进行二次分析，直接节省了用户的事件。motif部分由于数据直接通过python发送给js，没有php二次处理，所以motif数据写入sql有单独的文件。

python文件用户进行具体的处理，比如写入文件（因为发现php没有权限写入文件），用edirect在NCBI进行查询，用不同的命令行工具进行分析和文件处理（具体参考core functionalities）。最终的结果文件均保存在results中。Biopython的edirect库，命令行的IQ-tree，EMBOSS被用来进行了searching，phylogenetic reconstruction，conservation plot 和 motif searching。

### Database design

我的数据库表由4个表组成，Searching table用于存储sequence searching序列, 会保存unique id (这个是primary key), 对应的fasta文件的路径 (./results/seq_xxx/original_seq.fasta)， 还有sequence的获取方式，是用户上传还是通过查询得到的。这个表的数据是在用户上传或者searching的时候insert的。剩下三个表对应三种analysis: Motif, Tree 和Conservation. 每个表都有自增的id作为主键，同时引入Searching表的unique id作为外键。Motif表中保存了Motif_list(在sequences中被发现的motif 名字)，总共的sequence数量和有motif的sequence的数量。同时motif analysis的所有结果文件的压缩包的路径也被保存。Tree 文件保存了Newick format的tree file的路径和所有结果的压缩包的路径，tree file可以用于iTOL网站中的tree reconstruction，所以要单独发给用户，方便它们使用。Conservation 文件保存了conservation plot的路径因为要前端直接展示给用户，同时也保存了压缩包的路径。这三个表分别在不同的analysis的时候insert数据

用户在history track页面输入tracking id，也就对应着四个表中的unqiue id。然后会通过js发送给php，php用pdo先在searching表进行查询，没有结果直接返回，如果有结果再去另外三个表查询，因为用户可能只进行过查询，没有进行过其他analysis，所以可能只有searching的结果，这时候不需要展示analysis表格，只用告诉用户没有分析过，但是找到了查询的文件即可。如果在三个analysis之一查到了结果，通过table形式给用户显示他之前的分析记录。 


### Core functionalities

protein sequence searching

用户输入了protein name和species name以后, 先通过JS进行是否输入的简单判断，再把数据传递给后端。php接收到数据以后进行防注入处理。php把数据发送给python，通过调用python文件。python中接收到数据，先通过Biopython的esearch和efetch获取物种id，因为用户可能输入一些比较broad的物种名，直接通过用户输入可能查不到。如果没有物种id则直接通过用户输入进行查询尝试。先用esearch来查询结果idList，没有的话直接返回并报给php。如果有idlist结果，进行efetch获取sequence并写入到一个文件中，该文件存入unique id命名的文件夹路径下，并把unique id返回给php，方便php在sql记录这些信息。

conservation plot

python文件获取php传递的unique id，并切换到该id命名的文件下路径下。通过EMBOSS的clustalo进行sequence的multiple alignment，然后通过plotcon绘制plot。由于plotcon默认会在终端打印结果，这个打印影响传给php的结果，所以要用stdbuf -oL -eL限制输出。最后所有的文件，原始sequence，aligned sequence还有plot会被打包成压缩文件，文件路径最终会返回给js，这样用户可以通过a标签下载该文件。打包的时候用了 zip -qr防止打包文件成功的终端输出。  图片的路径也会返回给js用于页面结果展示

motif searching

python 获取php传递的unique id，并切换到该id命名的文件路径下。然后把原始文件中的sequences分别提取，保存在各自独立的fasta文件中，这样才能每个文件通过EMBOSS的patmatmotifs单独进行motif searching。同样为了防止终端输出，用了stdbuf -oL -eL。有motif结果的motif文件被保存下来，通过循环查看这些文件，统计了有motif的sequence 个数，motif的名字等信息直接发送给JS 用于页面展示

tree

和conservationplot的开始类似，先进行了clustalo 的alignment，然后处理了aligned sequence的header部分的名字，把protein name和species name放到开头并用_连接，这样之后用户的treefile文件的每一个node都是protein name和species name组成，而不是not human readable的accession number。然后通过调用命令行中的iqtree来进行phylogenetic reconstruction。 生成的treefile文件路径单独返回给js，还有打包好的压缩包。treefile文件用户下载以后可以跳转到iTOL网页上传结果并查看tree。

example data

在index page，我设立了专门用于用户尝试example data的地方，用户可以点击拷贝example data的tracking id，并在history track页面获取分析的结果。这个数据集的结果已经存储在sql数据库中。用户也可以输入tracking id在analysis页面来查询分析结果。由于结果已经在数据库，用户无需等待。



### User Experience Considerations

Both the **About** and **Help** pages feature a  **floor-based navigation system** , allowing users to quickly jump to specific sections by clicking on the sidebar menu. The navigation bar dynamically updates its style based on user interactions, ensuring that the currently selected section is visually highlighted. This functionality is implemented using a combination of **click event listeners** and  **scroll event tracking** .

When a user clicks on a navigation item, the page change to target part, and the clicked navigation item is visually highlighted. To maintain synchronization between the sidebar and the visible content, the `scroll` event is used to track the user’s position on the page. By monitoring `window.scrollY` in relation to each section’s `offsetTop` value, JavaScript determines which section is currently in view. Based on this calculation, the active state of the navigation bar is dynamically updated, ensuring that the correct navigation item is highlighted even when scrolling manually.

This feature improves the **user experience** by providing  **seamless navigation** , reducing the need for excessive scrolling, and enhancing usability on pages with substantial content. The combination of **click-based interactions and automatic scroll tracking** ensures an intuitive browsing experience, allowing users to efficiently navigate between sections.

在index界面，头部导航让用户可以直接跳转到analysis界面，然后可以跳转到具体想进行的analysis的页面。index的头部导航也能直接跳转search，history部分。index界面的footer部分支持用户跳转help或者about界面。index以外所有界面均可以通过点击右下角的HOME按钮返回index页。用户进行完一个分析以后，点击return button也可以直接跳转会analysis页面选择其他分析。history页面如果发现用户只有sequence searching记录没有进行分析也会鼓励用户直接跳转到分析页面。

search 和history中，如果用户没有查询到结果，会有错误提示，当用户重新开始输入查询内容时，输入提示消失，回到最初样式。在analysis失败的时候，会弹出错误提示框，并直接刷新页面让用户重试，这些方法增强了用户体验，用户不会因为出错需要手动刷新，不会一直停留在报错的页面。

在conservation 分析这里使用了图片，motif 分析也总结了一些查询结果，让用户可以更加直观的了解自己的结果，而不是费劲的查看压缩结果文件包。tree的tree-file文件进行过加工处理，用户上传到iTOL之后，会直接显示protein name和species name，而不是用户不友好的accession number，让用户可以更加直观的看结果。history track部分使用了表格来让用户查看不同的分析的结果。前后端交互使用了fetch，让用户体验流畅，因为不像表单提交一样需要刷新页面。

### Statement of Credits

AI 工具：

ChatGPT：用来制作website的大纲，确定要做几个页面还有页面的功能。代码报错的时候用来查找问题，学习pdo代码，修改页面上文字内容的语法，逻辑，词汇等等。学习await 和 async部分的内容。学习如何用php调用python并传参和获取结果。学习php的数组。

代码来源

引入了Animate.css的动画，来自https://animate.style/#usage

用CANVA进行网页设计布局，图片active_box.png, bord_box.png, Figures.png, loading.gif, heart.png, heart_box.png original_box.png均来自该网站 https://www.canva.com/design/

图片bird.png, background.jpg, pic1, pic2, pic3 均来自网站 https://pixabay.com/zh/images/

图片download_box.png 为本人手绘

网页的icon图标来自https://favicon.io/emoji-favicons/exploding-head/

search icon 的字体图标文件来自网站 https://www.iconfont.cn/fonts/

字体文件来自 https://www.dafont.com/more-sugar.font, https://font.download/font/gagalin
