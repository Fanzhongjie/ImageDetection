function [confirmArea, count] = cutPic(img, total)
% 本函数用图提取出细胞核区域
% 基于细胞核的颜色比一般的细胞质的颜色更深，而且占用的面积也不是很大，
% 且细胞核范围内颜色都很相近
% 所以根据rgb颜色空间中对三个色道的值分别进行排序，取出每个色道0.1出位置的值作为阈值判断
% 每个色道使用10的容错（即阈值+10）
[hei,wid,~] = size(img);
bw0 = zeros([hei,wid]);

confirmArea = [];
% resB = [];
count = 1;

% 0.1的冗余
% reshape的作用将矩阵转换为1行向量，以便排序
R = img(:,:,1);Rr = reshape(R', [1 hei*wid]);       % 第一个色道R
G = img(:,:,2);Gg = reshape(G', [1 hei*wid]);       % 第二个色道G
B = img(:,:,3);Bb = reshape(B', [1 hei*wid]);       % 第三个色道B

% 色道值排序
Rr = sort(Rr);
Gg = sort(Gg);
Bb = sort(Bb);
x = round(hei*wid*0.01);        %选择处于整体0.01处的值
sum = 0;

thr = [Rr(x) Gg(x) Bb(x)];      % 阈值确定
for i=1:hei
    for j=1:wid
        if R(i,j)<=thr(1)+10 && G(i,j)<=thr(2)+10 && B(i,j)<=thr(3)+10    % 每个色道10容错 （可调）
            bw0(i,j) = 1;
            sum = sum+1;
        end
    end
end

disp(['total:' num2str(total) ' sum:' num2str(sum)]);

if(sum > total*0.6)             % 整体判断出的细胞核的大小超过总大小的0.6倍，视为无效。 （可调）
    return;
end

S = double(hei*wid*0.01);
bw0 = imfill(bw0,'holes');      % 填充空洞
bw0 = bwareaopen(bw0,round(S)); % 删除小于整体0.01倍大小的区域

% figure;
% subplot(1,2,1); imshow(img); title('img');
% subplot(1,2,2); imshow(bw0); title('bw0');

% resimg = bw0;
bw01 = double(bw0);
w = fspecial('gaussian',[5 5]);         % 高斯滤波，平滑边缘
bw01 = imfilter(bw01, w, 'replicate');
% figure; imshow(bw01); title('bw01');
% pause();
[~,b]=bwboundaries(bw01,'noholes');     % ~处是每个图形的边缘坐标 元胞型，b是连通块
area=regionprops(b,'basic');            % 获取连通块的性质：在此用到 外接矩形（BoundingBox(x,y,w,h))
[num, ~] = size(area);

for i=1:num
    x1 = area(i).BoundingBox(1);
    y1 = area(i).BoundingBox(2);
    w1 = area(i).BoundingBox(3);
    h1 = area(i).BoundingBox(4);
    Ir = imcrop(bw01, [x1,y1,w1,h1]);
    SE = ones(2,4);
    E1 = imdilate(Ir,SE);
    BW = bwperim(E1,4);

%     figure; imshow(BW); title('BW');

    if(houghOri(BW) == 1)           % 判断该区域边界是否满足椭圆检测
        confirmArea(count,1) = x1;
        confirmArea(count,2) = y1;
        confirmArea(count,3) = w1;
        confirmArea(count,4) = h1;
%         resB{count} = b{i};
        count = count+1;
    end
end
