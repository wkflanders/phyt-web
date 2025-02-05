import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SellModal } from './SellModal';
import { User, CardWithMetadata } from '@phyt/types';
import Image from 'next/image';
import { parseEther } from 'viem';
import { useCreateListing } from '@/hooks/use-marketplace';
import { useToast } from '@/hooks/use-toast';

interface CardModalProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
    card: CardWithMetadata;
}

export const CardModal = ({ user, isOpen, onClose, card }: CardModalProps) => {
    const [isSellMode, setIsSellMode] = useState(false);
    const [listingPrice, setListingPrice] = useState('');
    const [expirationHours, setExpirationHours] = useState('24');
    const { toast } = useToast();
    const createListing = useCreateListing(user);

    if (!card) return null;

    const handleCreateListing = async () => {
        try {
            const expiration = new Date();
            expiration.setHours(expiration.getHours() + parseInt(expirationHours));

            await createListing.mutateAsync({
                cardId: card.id,
                tokenId: card.token_id,
                takePrice: parseEther(listingPrice),
                expiration: expiration.toISOString()
            });

            setIsSellMode(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create listing",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-phyt_bg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogTitle></DialogTitle>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                    {/* (1,1) Card Image */}
                    <div className="col-span-1 row-span-1 flex justify-center items-center">
                        <Image
                            src={card.metadata.image_url}
                            alt={`Card ${card.metadata.token_id}`}
                            width={200}
                            height={300}
                            className="rounded-lg w-[300px] h-[500px]" />
                    </div>

                    {/* (1,2) Price Over Time Chart */}
                    <div className="col-span-1 row-span-1">
                        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                            <p className="text-white">Price Over Time Chart</p>
                        </div>
                    </div>

                    {/* (2,1) Price Info & Actions */}
                    <div className="col-span-1 row-span-1">
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="bg-black p-4 rounded-lg border border-gray-800 flex-1">
                                    <p className="text-sm text-phyt_text_secondary mb-1">Price</p>
                                    <p className="text-lg font-bold text-white">0.007</p>
                                </div>
                                <div className="bg-black p-4 rounded-lg border border-gray-800 flex-1">
                                    <p className="text-sm text-phyt_text_secondary mb-1">Highest bid</p>
                                    <p className="text-lg font-bold text-white">0.005</p>
                                </div>
                                <div className="bg-black p-4 rounded-lg border border-gray-800 flex-1">
                                    <p className="text-sm text-phyt_text_secondary mb-1">Last sale</p>
                                    <p className="text-lg font-bold text-white">0.006</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    onClick={() =>
                                        toast({
                                            title: "Coming Soon",
                                            description: "Buy functionality will be available soon!",
                                        })
                                    }
                                    className="w-full bg-phyt_blue hover:bg-phyt_blue/80"
                                >
                                    Buy
                                </Button>
                                <Button
                                    onClick={() => setIsSellMode(true)}
                                    className="w-full bg-phyt_blue hover:bg-phyt_blue/80"
                                >
                                    Sell
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        toast({
                                            title: "Coming Soon",
                                            description: "Bid functionality will be available soon!",
                                        })
                                    }
                                    className="w-full border-gray-800 text-white hover:bg-gray-800"
                                >
                                    Bid
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* (2,2) Runner's Stats */}
                    <div className="col-span-1 row-span-1">
                        <div className="bg-gray-800 p-4 rounded-lg space-y-2">
                            <div>
                                <p className="text-sm text-phyt_text_secondary">Total Distance Ran</p>
                                <p className="text-lg font-bold text-white">X mi</p>
                            </div>
                            <div>
                                <p className="text-sm text-phyt_text_secondary">Pace</p>
                                <p className="text-lg font-bold text-white">Y /mi</p>
                            </div>
                            <div>
                                <p className="text-sm text-phyt_text_secondary">Best Time</p>
                                <p className="text-lg font-bold text-white">Z</p>
                            </div>
                        </div>
                    </div>
                </div>

                <SellModal
                    isOpen={isSellMode}
                    onClose={() => setIsSellMode(false)}
                    card={card}
                />
            </DialogContent>
        </Dialog>
    );
};
