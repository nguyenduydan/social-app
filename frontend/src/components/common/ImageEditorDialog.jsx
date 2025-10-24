import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const ImageEditorDialog = ({ open, onClose, imageSrc, onSave, aspect = 1, loading }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImage = useCallback(async () => {
        const createImage = (url) =>
            new Promise((resolve, reject) => {
                const image = new Image();
                image.src = url;
                image.onload = () => resolve(image);
                image.onerror = (err) => reject(err);
            });

        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { x, y, width, height } = croppedAreaPixels;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
                resolve(file);
            }, "image/jpeg");
        });
    }, [imageSrc, croppedAreaPixels]);

    const handleSave = async () => {
        const croppedFile = await getCroppedImage();
        await onSave(croppedFile);
    };

    return (
        <Dialog open={open} onOpenChange={!loading ? onClose : undefined}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa hình ảnh</DialogTitle>
                    <DialogDescription />
                </DialogHeader>

                <div className={`relative w-full h-80 bg-black rounded-md overflow-hidden ${loading ? "pointer-events-none " : ""}`}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        disabled={loading}
                    />
                </div>

                <div className="mt-4 space-y-2">
                    <span className="text-sm text-muted-foreground">Phóng to</span>
                    <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(v) => setZoom(v[0])}
                        disabled={loading}
                    />
                </div>

                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner /> Đang lưu...
                            </>
                        ) : (
                            "Lưu"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImageEditorDialog;
