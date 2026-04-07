import { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Bot, User, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { fetchApi } from '../utils/api';
import { getImageUrl } from '../utils/imageHelper';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', type: 'text', text: "Ready for your EduCart queries. How can I help you today? (Try asking me about shipping, your orders, or searching for products like 'shoes under 200')" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const faqs = ["Shipping info", "Return policy", "Payment methods"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', type: 'text', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetchApi('/api/chatbot/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           message: userMessage,
           userId: user ? user._id : null
        })
      });

      const responseData = await response.json();
      const { type, message: botMessage, data, actionType } = responseData;
      
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        type: type || 'text', 
        text: botMessage,
        data: data,
        actionType: actionType
      }]);

    } catch (error) {
        console.error('Chat error:', error);
        setMessages(prev => [...prev, { 
            sender: 'bot', 
            type: 'text', 
            text: "Sorry, I'm having trouble connecting to the server. Please try again later." 
        }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFAQ = (faqText) => {
      const e = { preventDefault: () => {} };
      setInput(faqText);
      // We need to wait for state to update, or just pass directly
      setTimeout(() => {
          document.getElementById("chat-submit-btn")?.click();
      }, 0);
  };

  const renderText = (text) => {
      if (!text) return null;
      return text.split('\n').map((line, i) => (
          <span key={i}>
              {line.split('**').map((part, index) => index % 2 === 1 ? <strong key={index}>{part}</strong> : part)}
              <br />
          </span>
      ));
  };


  const handleAction = (msg) => {
      if (msg.actionType === 'cart_checkout') {
          setIsOpen(false);
          navigate('/checkout');
      } else if (msg.actionType === 'cart_add') {
          setIsOpen(false);
          navigate('/shop');
      } else {
          setIsOpen(false);
          navigate('/cart');
      }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
      >
        <MessageCircle size={28} className="group-hover:animate-pulse" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center animate-bounce">1</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300">
      {/* Header */}
      <div className="bg-indigo-600 dark:bg-indigo-700 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-semibold leading-tight">EduCart Assistant</h3>
            <p className="text-indigo-100 text-xs">Online & Ready to Help</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 h-96 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`mt-auto mb-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {renderText(msg.text)}
                </p>
                
                {/* Product List Render */}
                {msg.type === 'products' && msg.data && msg.data.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.data.map(product => (
                      <Link 
                        to={`/product/${product._id}`} 
                        key={product._id}
                        className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <img src={getImageUrl(product.image)} alt={product.name} className="w-10 h-10 object-cover rounded" onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate text-slate-800 dark:text-slate-200">{product.name}</p>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">PKR {product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Orders List Render */}
                {msg.type === 'orders' && msg.data && msg.data.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.data.map(order => (
                      <Link 
                        to={`/order/${order._id}`} 
                        key={order._id}
                        className="block p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600 hover:border-indigo-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">#{order._id.substring(order._id.length - 6)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            order.isDelivered ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 
                            order.isShipped ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                          }`}>
                            {order.isDelivered ? 'Delivered' : order.isShipped ? 'Shipped' : 'Processing'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">PKR {order.totalPrice}</p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Action Button Render */}
                {msg.type === 'action' && (
                    <button 
                        onClick={() => handleAction(msg)}
                        className="mt-3 w-full py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:hover:bg-indigo-800/60 dark:text-indigo-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        {msg.actionType === 'cart_checkout' ? <><ShoppingBag size={14}/> Checkout Now</> : 
                         msg.actionType === 'cart_add' ? <><ShoppingBag size={14}/> View Shop</> :
                         <><Package size={14}/> Manage Cart</>}
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] gap-2 flex-row">
              <div className="mt-auto mb-1 flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Bot size={16} />
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick FAQ Chips */}
      <div className="px-3 pt-2 pb-1 bg-white dark:bg-slate-800 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 border-t border-slate-100 dark:border-slate-700">
          {faqs.map((faq, i) => (
             <button key={i} onClick={() => handleQuickFAQ(faq)} 
                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 rounded-full hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/40 transition-colors">
                {faq}
             </button>
          ))}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
            autoFocus
          />
          <button 
            id="chat-submit-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors flex items-center justify-center shrink-0"
          >
            <Send size={18} className={input.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
