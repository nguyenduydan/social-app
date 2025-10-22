import React, { useEffect, useState } from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { X, Image, User, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { CustomSelect } from "../common/customSelect";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Spinner } from "../ui/spinner";

const options = [
    { value: "public", label: "Công khai" },
    { value: "friends", label: "Bạn bè" },
    { value: "private", label: "Chỉ mình tôi" },
];

const CreatePost = ({ onOpen, onClose }) => {
    const { createPost, creatingPost } = usePostStore();
    const { user } = useAuthStore();

    const [content, setContent] = useState("");
    const [media, setMedia] = useState([]); // chỉ lưu file local
    const [visibility, setVisibility] = useState("public");
    const [charCount, setCharCount] = useState(0);
    const maxChars = 500;

    useEffect(() => {
        if (onOpen) {
            setContent("");
            setMedia([]);
            setCharCount(0);
            setVisibility("public");
        }
    }, [onOpen]);

    const handleTextChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setContent(text);
            setCharCount(text.length);
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        setMedia((prev) => [
            ...prev,
            ...selectedFiles.map((file) => ({
                file, // giữ gốc để upload
                preview: URL.createObjectURL(file),
                type: file.type.startsWith("video/") ? "video" : "image",
            })),
        ]);
    };

    const handleRemoveMedia = (index) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && media.length === 0) return;

        try {

            // Call API to create post
            await createPost({ content, media, visibility });

            setContent("");
            setMedia([]);
            setCharCount(0);
            setVisibility("public");
            onClose?.();
        } catch (error) {
            console.error("Tạo bài viết thất bại:", error);
        }
    };

    return (
        <DialogContent className="w-full md:min-w-lg p-0 gap-0 border-0">
            {/* Header */}
            <DialogHeader className="px-6 py-4 border-b border-gray-200 relative">
                <DialogTitle className="text-xl font-bold">
                    Tạo bài viết
                </DialogTitle>
                <DialogDescription />
            </DialogHeader>

            {/* User Info */}
            <div className="px-6 pt-4 pb-2">
                <div className="flex items-center gap-3">
                    <Avatar className="size-12 transition-all duration-300">
                        <AvatarImage src={user.avatar.url || ""} alt={user?.displayName || "user"} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                        <h3 className="font-semibold">{user?.displayName || "Người dùng"}</h3>
                        <CustomSelect
                            options={options}
                            value={visibility}
                            onChange={setVisibility}
                        />
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                {/* Text Area */}
                <div className="inline-block w-full px-6 py-2 " >
                    <textarea
                        value={content}
                        onChange={(e) => {
                            handleTextChange(e);
                            e.target.style.height = "auto";
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        placeholder={`${user?.displayName || "Bạn"}, bạn đang nghĩ gì thế?`}
                        className="w-full max-h-30 bg-transparent placeholder-gray-400 resize-none focus:outline-none text-lg"
                        rows={1}
                    />
                    <div className="flex justify-end">
                        <span
                            className={`text-sm ${charCount > maxChars * 0.9
                                ? "text-red-500"
                                : "text-gray-400"
                                }`}
                        >
                            {charCount}/{maxChars}
                        </span>
                    </div>
                </div>

                {/* Media Preview */}
                {media.length > 0 && (
                    <div
                        className={`scrollbar-custom px-6 mb-4 grid gap-3 max-h-[250px] md:max-h-[400px] overflow-y-auto  ${media.length === 1
                            ? "grid-cols-1"
                            : media.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2 sm:grid-cols-3"
                            }`}
                    >
                        {media.map((item, idx) => (
                            <div key={idx} className="relative group w-full rounded-lg">
                                {item.file.type.startsWith("video/") ? (
                                    <video
                                        src={item.preview}
                                        className="w-full h-auto object-contain rounded-lg"
                                        muted
                                        controls
                                        disabled={creatingPost}
                                    />
                                ) : (
                                    <img
                                        src={item.preview}
                                        alt={`preview-${idx}`}
                                        className="w-full h-auto object-contain rounded-lg"
                                    />
                                )}
                                <Button
                                    type="button"
                                    disabled={creatingPost}
                                    variant="ghost"
                                    onClick={() => handleRemoveMedia(idx)}
                                    className="absolute top-2 right-2 h-6 w-0 p-0 hover:bg-destructive rounded-full transition "
                                >
                                    <XCircle className="text-white size-5 p-0" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}


                {/* Media Options */}
                <div className="px-6 py-2 border border-gray-200 mx-6 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            Thêm vào bài viết
                        </span>
                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="media-upload"
                                className="cursor-pointer hover:bg-gray-200/50 dark:hover:bg-gray-200/20 px-3 py-3 rounded-full transition-colors"
                            >
                                <Image className="text-primary size-6" />
                            </label>
                            <input
                                id="media-upload"
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={creatingPost}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-4">
                    <Button
                        type="submit"
                        disabled={(!content.trim() && media.length === 0) || creatingPost}
                        className={`w-full py-5 text-lg rounded-lg shadow-md font-semibold transition-all ${content.trim() || media.length
                            ? "bg-primary hover:brightness-130 text-white cursor-pointer"
                            : "bg-neutral-300 hover:bg-neutral-300 dark:bg-muted dark:hover:bg-muted text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {creatingPost ? (
                            <>
                                <Spinner /> Đang đăng...
                            </>
                        ) : (
                            "Đăng"
                        )}
                    </Button>
                </div>
            </form>
        </DialogContent>
    );
};

export default CreatePost;
