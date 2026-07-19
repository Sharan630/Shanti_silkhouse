export const WHATSAPP_NUMBER = '919591128327';

export const buildWhatsAppUrl = (message = '') => {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const openWhatsApp = (message = '') => {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};

export const buildProductWhatsAppMessage = (product) => {
  const image = product?.image || (product?.images && product.images[0]) || '';
  const productUrl = `${window.location.origin}/product/${product?.slug || product?.id}`;
  const price = product?.price != null ? Number(product.price).toLocaleString() : 'N/A';

  return `${image ? `${image}\n\n` : ''}Hi! I am interested in *${product?.name || 'this saree'}* priced at ₹${price}.\nView product: ${productUrl}\nPlease provide more details.`;
};

export const openWhatsAppForProduct = (product) => {
  openWhatsApp(buildProductWhatsAppMessage(product));
};

export const openWhatsAppVideoCall = (product = null) => {
  const message = product
    ? `Hi! I would like a video call to view *${product.name}* (₹${Number(product.price).toLocaleString()}).\n${window.location.href}`
    : 'Hi! I would like to schedule a video call shopping session for sarees at Shanti Silk House. Please let me know a convenient time.';

  openWhatsApp(message);
};

export const shareContent = async ({ title, text, url } = {}) => {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText = text || shareTitle;

  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      return { success: true, method: 'share' };
    } catch (error) {
      if (error?.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
    }
  }

  try {
    await navigator.clipboard.writeText(shareUrl);
    return { success: true, method: 'clipboard' };
  } catch {
    window.prompt('Copy this link:', shareUrl);
    return { success: true, method: 'prompt' };
  }
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
