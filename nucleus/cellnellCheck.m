function cellnellCheck()
% 在此函数中主要是排除大部分的培养液成分
% 首先根据灰度图中的灰度值排除在整体排序后的0.4位置处的灰度值以上的所有区域（0.4 参数可调）
% 其次根据HSV空间中的亮度值排除在整体排序后的0.9位置处的H值以下的所有区域（0.9 参数可调）
% 最终结果取两者的交集。

img = imread('picture/3.bmp');
% img = imread('picture/2.jpg');
% im1 = imadjust(img, [.3 .3 0;.7 .7 1], []);
im1 = img;
[hei, wid, ~] = size(im1);
gray_im = rgb2gray(im1);
%sub_gray = imresize(gray_im, [hei wid*4]);

S = double(uint16(hei*wid*0.003));
% 首先确定细胞质的色彩，根据这个色彩划分区域
% 从这个区域中根据(范围) 细胞很大
% cu保存所有的gray值
cu = reshape(gray_im', [1 hei*wid]);
% for i=1:hei
%     cu = [cu, sub_gray(i,:)];
% end
cu = sort(cu);
th1 = cu(max(round(hei*wid*0.4),1))+10;
a = double(th1)/255;
bw_f = im2bw(gray_im, a);
% figure; imshow(bw_f); title('bw_f');
bw00 = bwareaopen(~bw_f, S);
% figure; imshow(bw00); title('bw_00');

% 转换到hsv空间，提取出所有h值大于200
himg = rgb2hsv(img);
% hbw1 = im2bw(himg(:,:,1),200/360);
% hbw2 = im2bw(himg(:,:,2),0.2);
hpi = [];
disp('enter here!');
H = himg(:,:,1);
for i=1:hei
    hpi = [hpi,H(i,:)];
end
% return;

hpi = sort(hpi);
hth = double(hpi(max(round(hei*wid*0.9),1)));
res_hbw = im2bw(himg(:,:,1), hth);
% hbw1 = im2bw(himg(:,:,1),200/360);
hbw = imfill(res_hbw,'holes');
% figure;
% subplot(1,3,2); imshow(hbw); title('h');

bw_all = hbw & bw00;
bw_all = bwareaopen(bw_all,S);
figure; imshow(bw_all);

[b,L]=bwboundaries(bw_all,'noholes');     % B是每个图形的边缘坐标 元胞型，L是连通块
area=regionprops(L,'basic');
[num, ~] = size(area);

figure;
imshow(img);
hold on;
for i=1:num
    x1 = round(area(i).BoundingBox(1));
    y1 = round(area(i).BoundingBox(2));
    w1 = round(area(i).BoundingBox(3));
    h1 = round(area(i).BoundingBox(4));
    disp(['x1:' num2str(x1) ' y1:' num2str(y1) ' w1:' num2str(w1) ' h1:' num2str(h1)]);
    Ir = imcrop(img, [x1, y1, w1, h1]);
    [total,~] = size(find(bw_all(y1:y1+h1-1, x1:x1+w1-1)==1));  % 计算面积比
%     [total,~] = size(find(b{i}));
%     figure;imshow(Ir);
    [cellArea, count] = cutPic(Ir, total);
    disp(['count:' num2str(count)]);
    [cellNum, ~] = size(cellArea);

    for j=1:cellNum
        x = x1 + cellArea(j,1);
        y = y1 + cellArea(j,2);
        x0 = x + round(cellArea(j,3)/2);
        y0 = y + round(cellArea(j,4)/2);
        plot(x0,y0,'r+');
%         x01 = L{1}(:,1)' + x;
%         y01 = L{1}(:,2)' + y;
%         plot(x01,y01,'r-');
    end
    %在进行一次阈值分割
end
hold off;
